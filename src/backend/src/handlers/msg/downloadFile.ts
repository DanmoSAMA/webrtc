/**
 * description: 下载文件
 * date: 2024-03-17 10:17:17 +0800
 */

import { UPLOAD_PATH } from '@consts/index';
import { isTokenValid } from '@utils/jwt';
import { Middleware } from 'koa';
import { HttpCode } from '../../../../shared/consts/httpCode';
import * as path from 'path';
import * as fs from 'fs';

export const downloadFile: Middleware = (ctx) => {
  const filename = ctx.params.filename;
  const token = ctx.request.headers.authorization;

  // TODO: 权限校验 群A（但不在群B）的用户不能下载群B的文件
  if (!isTokenValid(token)) {
    ctx.body = {
      status: 200,
      msg: 'ok',
      code: HttpCode.INVALID_TOKEN,
      data: null,
    };
    return;
  }

  const filePath = path.join(UPLOAD_PATH, filename);
  const fileExists = fs.existsSync(filePath);

  if (fileExists) {
    // ctx.set('Content-Disposition', `attachment; filename="${filename}"`);
    ctx.set('Content-Type', 'application/octet-stream');
    console.log(fs.createReadStream(filePath));
    ctx.body = fs.createReadStream(filePath);
  } else {
    ctx.status = 404;
    ctx.body = 'File not found';
  }
};

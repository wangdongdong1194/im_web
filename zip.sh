#!/bin/bash
zip -r im_web.zip . -x "*/.git/*" -x "*/node_modules/*"
echo "✅ 压缩完成，已排除 .git、node_modules 目录"

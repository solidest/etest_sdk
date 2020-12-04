

qjsc -o parse.exe quick_parse.js
gcc out.c lib/quickjs/libquickjs.a -o parse.exe

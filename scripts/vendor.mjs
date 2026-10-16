import {mkdir,copyFile,readdir,writeFile} from 'node:fs/promises';import {createHash} from 'node:crypto';
const base=new URL('../',import.meta.url);const copy=async(a,b)=>{const dst=new URL(b,base);await mkdir(new URL('./',dst),{recursive:true});await copyFile(new URL(a,base),dst)};
for(const f of ['tesseract.min.js','worker.min.js','tesseract.min.js.LICENSE.txt','worker.min.js.LICENSE.txt'])await copy('node_modules/tesseract.js/dist/'+f,'vendor/tesseract/'+f);
for(const f of await readdir(new URL('node_modules/tesseract.js-core/',base)))if(/\.wasm(\.js)?$/.test(f)||f==='LICENSE')await copy('node_modules/tesseract.js-core/'+f,'vendor/tesseract-core/'+f);
for(const f of ['pdf.min.mjs','pdf.worker.min.mjs'])await copy('node_modules/pdfjs-dist/build/'+f,'vendor/pdfjs/'+f);
await copy('node_modules/pdfjs-dist/LICENSE','vendor/pdfjs/LICENSE');await copy('node_modules/fflate/umd/index.js','vendor/fflate.js');await copy('node_modules/fflate/LICENSE','vendor/fflate-LICENSE');
for(const [url,path] of [['https://cdn.sheetjs.com/xlsx-0.20.3/package/dist/xlsx.full.min.js','vendor/xlsx.full.min.js'],...['heb','eng'].map(lang=>['https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/'+lang+'.traineddata','vendor/lang/'+lang+'.traineddata'])]){const r=await fetch(url);if(!r.ok)throw Error(path+': HTTP '+r.status);const bytes=new Uint8Array(await r.arrayBuffer());await mkdir(new URL('./',new URL(path,base)),{recursive:true});await writeFile(new URL(path,base),bytes);console.log(path,bytes.length,createHash('sha256').update(bytes).digest('hex'))}

for(const dir of ['standard_fonts','cmaps'])for(const f of await readdir(new URL('node_modules/pdfjs-dist/'+dir+'/',base)))await copy('node_modules/pdfjs-dist/'+dir+'/'+f,'vendor/pdfjs/'+dir+'/'+f);

for(const [url,path] of [["https://raw.githubusercontent.com/tesseract-ocr/tessdata_fast/main/LICENSE","vendor/lang/LICENSE"],["https://cdn.sheetjs.com/xlsx-0.20.3/package/LICENSE","vendor/SheetJS-LICENSE"]]){const r=await fetch(url);if(!r.ok)throw Error(path+": HTTP "+r.status);await writeFile(new URL(path,base),await r.text())}

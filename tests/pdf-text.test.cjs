const {test}=require('node:test'),A=require('node:assert/strict'),fs=require('node:fs');
const P=require('../pdf-text.js');
test('searchable PDF embeds valid Unicode font and preserves Russian, Hebrew and shekel text',async()=>{
 require('../compat.js');const text='Проверка שלום 191,30 ₪',font=fs.readFileSync('vendor/fonts/DejaVuSans.ttf'),jpg=fs.readFileSync('tests/fixtures/synthetic-page.jpg');
 const info=P.fontInfo(font,Array.from(text));for(const cp of ['П','ש','₪'].map(x=>x.codePointAt(0)))A.ok(info.map[cp*2]||info.map[cp*2+1]);
 const bytes=P.build([jpg,jpg],[[{text,x:50,y:100,size:20}],[{text:'Вторая страница',x:50,y:100,size:20}]],font);
 const pdf=await import('../vendor/pdfjs/pdf.min.mjs');pdf.GlobalWorkerOptions.workerSrc=new URL('../vendor/pdfjs/pdf.worker.min.mjs',require('node:url').pathToFileURL(__filename)).href;
 const doc=await pdf.getDocument({data:bytes,disableFontFace:true,isEvalSupported:false}).promise;A.equal(doc.numPages,2);
 const extracted=(await (await doc.getPage(1)).getTextContent()).items.map(x=>x.str).join(' ');A.match(extracted,/Проверка/);A.match(extracted,/191,30/);A.match(extracted,/₪/);A.ok(extracted.includes('שלום')||extracted.includes('םולש'));await doc.cleanup?.();
 fs.writeFileSync('../Save_Cash_RC5_1_Searchable_QA.pdf',P.build([jpg],[[{text,x:50,y:100,size:20}]],font));
});

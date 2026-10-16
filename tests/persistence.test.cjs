const test=require('node:test'),assert=require('node:assert/strict'),{IDBFactory}=require('fake-indexeddb');
global.indexedDB=new IDBFactory();global.crypto=require('node:crypto').webcrypto;const S=require('../storage.js'),M=require('../model.js'),B=require('../backup.js'),zip=require('fflate');
test('IndexedDB upgrade preserves old state; ZIP restores state and original bytes on clean storage',async()=>{
const old=await new Promise((resolve,reject)=>{const r=indexedDB.open('save-cash',2);r.onupgradeneeded=()=>r.result.createObjectStore('state');r.onsuccess=()=>resolve(r.result);r.onerror=()=>reject(r.error)});
await new Promise((resolve,reject)=>{const t=old.transaction('state','readwrite');t.objectStore('state').put({schemaVersion:2,balance:123,purchases:[{id:'kept',name:'kept',amount:4}]},'current');t.oncomplete=resolve;t.onerror=()=>reject(t.error)});old.close();
assert.equal((await S.load()).purchases[0].id,'kept');const d=M.migrate(await S.load());const file=new File(['receipt original bytes'],'receipt.png',{type:'image/png'}),meta=await S.storeDocument(file,'receipt');assert.equal((await S.storeDocument(file)).id,meta.id);d.documents=[meta];d.purchases[0].document_id=meta.id;await S.save(d);
const bytes=await B.create(d,await S.documents(),zip),parsed=await B.parse(bytes,zip);assert.equal(parsed.data.balance,123);assert.equal(await parsed.documents[0].blob.text(),'receipt original bytes');
S.close();global.indexedDB=new IDBFactory();await S.restore(parsed.data,parsed.documents);assert.equal((await S.load()).purchases[0].id,'kept');assert.equal(await(await S.getDocument(meta.id)).blob.text(),'receipt original bytes');
const files=zip.unzipSync(bytes);files['data.json'][10]^=1;await assert.rejects(B.parse(zip.zipSync(files),zip),/целостность/);assert.equal((await S.load()).balance,123);S.close();
});

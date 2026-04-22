import { useState, useEffect, useRef, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://izvpdznzgmjmdmqrjcdn.supabase.co";
const SUPABASE_KEY = "sb_publishable_Q7EtEviZq7NeaIPAeAYLaA_qe2Ppfc5";
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function sGet(k, def) {
  try {
    const { data, error } = await supabase.from("app_data").select("value").eq("key", k).single();
    if (error || !data) return def;
    return JSON.parse(data.value);
  } catch { return def; }
}
async function sSave(k, v) {
  try {
    await supabase.from("app_data").upsert({ key: k, value: JSON.stringify(v), updated_at: new Date().toISOString() });
  } catch(e) { console.error(e); }
}

const G = `
@import url('https://fonts.googleapis.com/css2?family=Fraunces:ital,wght@0,400;0,700;0,900;1,400&family=Outfit:wght@300;400;500;600;700;800&display=swap');
*{box-sizing:border-box;margin:0;padding:0;}
body{font-family:'Outfit',sans-serif;background:#f0f2ee;color:#1a2216;}
button,input,select,textarea{font-family:'Outfit',sans-serif;}
::-webkit-scrollbar{width:5px;height:5px;}
::-webkit-scrollbar-track{background:transparent;}
::-webkit-scrollbar-thumb{background:#c8d4c0;border-radius:10px;}
.sidebar-link{display:flex;align-items:center;gap:10px;padding:10px 16px;border-radius:12px;cursor:pointer;font-size:13px;font-weight:600;color:#5a6e52;transition:all .15s;border:none;background:none;width:100%;text-align:left;}
.sidebar-link:hover{background:rgba(20,83,45,0.07);color:#14532d;}
.sidebar-link.active{background:#14532d;color:#fff;}
.card{background:#fff;border-radius:16px;padding:20px;box-shadow:0 1px 8px rgba(0,0,0,0.05);margin-bottom:16px;}
.btn-primary{background:#14532d;color:#fff;border:none;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;transition:opacity .15s;}
.btn-primary:hover{opacity:.88;}
.btn-secondary{background:#f0f2ee;color:#374151;border:none;border-radius:10px;padding:9px 18px;font-size:13px;font-weight:700;cursor:pointer;display:inline-flex;align-items:center;gap:6px;}
.btn-danger{background:#fee2e2;color:#dc2626;border:none;border-radius:10px;padding:7px 14px;font-size:12px;font-weight:700;cursor:pointer;}
.btn-ghost{background:none;border:1.5px solid #d1d5db;border-radius:10px;padding:7px 14px;font-size:12px;font-weight:600;cursor:pointer;color:#374151;}
.input{width:100%;padding:9px 13px;border-radius:10px;border:1.5px solid #e5e7eb;font-size:13px;outline:none;background:#fafafa;transition:border .15s;}
.input:focus{border-color:#14532d;}
.label{font-size:12px;font-weight:700;color:#374151;margin-bottom:5px;display:block;}
.badge{display:inline-flex;align-items:center;padding:3px 9px;border-radius:20px;font-size:11px;font-weight:700;white-space:nowrap;}
.table{width:100%;border-collapse:collapse;}
.table th{background:#f8faf6;padding:10px 14px;text-align:left;font-size:12px;font-weight:700;color:#6b7280;border-bottom:1.5px solid #e5e7eb;}
.table td{padding:10px 14px;font-size:13px;border-bottom:1px solid #f3f4f6;vertical-align:top;}
.table tr:hover td{background:#fafff8;}
.modal-overlay{position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:200;display:flex;align-items:center;justify-content:center;padding:20px;}
.modal-box{background:#fff;border-radius:20px;width:100%;max-width:680px;max-height:90vh;overflow-y:auto;padding:28px;}
.chip{display:inline-flex;align-items:center;gap:5px;padding:4px 10px;border-radius:20px;font-size:11px;font-weight:700;cursor:pointer;}
.tag-filter{padding:5px 13px;border-radius:20px;border:1.5px solid #e5e7eb;font-size:12px;font-weight:600;cursor:pointer;background:#fff;color:#374151;transition:all .15s;}
.tag-filter.active{background:#14532d;color:#fff;border-color:#14532d;}
.sidebar{transition:transform .25s ease;}
.sidebar-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.4);z-index:9;}
.menu-toggle{display:none;position:fixed;top:12px;left:12px;z-index:30;background:#14532d;border:none;border-radius:10px;width:42px;height:42px;cursor:pointer;align-items:center;justify-content:center;font-size:20px;color:#fff;box-shadow:0 2px 8px rgba(0,0,0,0.2);}
@media(max-width:768px){
  .menu-toggle{display:flex;}
  .sidebar{position:fixed!important;top:0;left:0;height:100vh;z-index:20;transform:translateX(-100%);}
  .sidebar.open{transform:translateX(0)!important;}
  .sidebar-overlay.open{display:block;}
  .main-content{margin-left:0!important;padding:20px 16px 80px!important;padding-top:64px!important;}
}
.split{display:grid;grid-template-columns:1fr 1fr;gap:14px;}
.split3{display:grid;grid-template-columns:1fr 1fr 1fr;gap:14px;}
`;

const INIT_EMPS = [
  {id:1,nom:"Martin Dubois",poste:"Ouvrier Espaces Verts",matricule:"OEV-001",photo:null,tel:"06 12 34 56 78",email:"m.dubois@societe.fr",dateEntree:"2022-03-15",infoPerso:{adresse:"12 rue des Lilas, 57100 Thionville",urgenceNom:"Claire Dubois",urgenceTel:"06 98 76 54 32",groupeSanguin:"A+",taille:"L",pointure:"43",notes:"Port de lunettes"}},
  {id:2,nom:"Sophie Bernard",poste:"Chef d'equipe",matricule:"CE-002",photo:null,tel:"06 23 45 67 89",email:"s.bernard@societe.fr",dateEntree:"2019-06-01",infoPerso:{adresse:"5 avenue Gambetta, 57000 Metz",urgenceNom:"Jean Bernard",urgenceTel:"06 87 65 43 21",groupeSanguin:"O+",taille:"M",pointure:"39",notes:"Allergie abeilles"}},
  {id:3,nom:"Karim Meziane",poste:"Conducteur d'engins",matricule:"CE-003",photo:null,tel:"06 34 56 78 90",email:"k.meziane@societe.fr",dateEntree:"2021-09-12",infoPerso:{adresse:"8 rue Victor Hugo, 57100 Thionville",urgenceNom:"Fatima Meziane",urgenceTel:"06 76 54 32 10",groupeSanguin:"B+",taille:"XL",pointure:"44",notes:""}},
  {id:4,nom:"Julie Pernet",poste:"Applicateur phyto",matricule:"AP-004",photo:null,tel:"06 45 67 89 01",email:"j.pernet@societe.fr",dateEntree:"2023-01-10",infoPerso:{adresse:"3 impasse des Roses, 57970 Yutz",urgenceNom:"Marc Pernet",urgenceTel:"06 65 43 21 09",groupeSanguin:"AB-",taille:"S",pointure:"37",notes:""}},
  {id:5,nom:"Thomas Roche",poste:"Responsable HSE",matricule:"HSE-005",photo:null,tel:"06 56 78 90 12",email:"t.roche@societe.fr",dateEntree:"2018-11-20",infoPerso:{adresse:"22 rue de la Paix, 57000 Metz",urgenceNom:"Marie Roche",urgenceTel:"06 54 32 10 98",groupeSanguin:"O-",taille:"L",pointure:"42",notes:"Sauveteur SST referent"}},
];
const POSTES_LIST=["Ouvrier Espaces Verts","Chef d'equipe","Conducteur d'engins","Applicateur phyto","Responsable HSE","Agent de maitrise","Chauffeur PL"];
const INIT_FORM_DATES={
  "1-1":{date:"2024-03-15",nomDoc:null,document:null},"1-2":{date:"2024-01-20",nomDoc:null,document:null},
  "1-3":{date:"2023-11-10",nomDoc:null,document:null},"1-4":{date:"2024-05-05",nomDoc:null,document:null},
  "1-5":{date:"2024-06-01",nomDoc:null,document:null},"2-2":{date:"2022-09-12",nomDoc:null,document:null},
  "2-3":{date:"2023-04-18",nomDoc:null,document:null},"2-5":{date:"2022-07-22",nomDoc:null,document:null},
  "3-3":{date:"2021-08-30",nomDoc:null,document:null},"4-4":{date:"2022-03-14",nomDoc:null,document:null},
  "4-2":{date:"2021-11-19",nomDoc:null,document:null},"5-1":{date:"2024-08-10",nomDoc:null,document:null},
  "5-2":{date:"2024-07-15",nomDoc:null,document:null},"5-3":{date:"2024-09-01",nomDoc:null,document:null},
  "6-1":{date:"2023-05-20",nomDoc:null,document:null},"6-2":{date:"2023-05-20",nomDoc:null,document:null},
  "6-3":{date:"2023-05-20",nomDoc:null,document:null},"7-1":{date:"2024-02-28",nomDoc:null,document:null},
  "7-2":{date:"2024-02-28",nomDoc:null,document:null},"7-3":{date:"2024-02-28",nomDoc:null,document:null},
  "7-4":{date:"2024-02-28",nomDoc:null,document:null},"7-5":{date:"2024-02-28",nomDoc:null,document:null},
  "8-1":{date:"2025-01-10",nomDoc:null,document:null},"8-2":{date:"2025-01-10",nomDoc:null,document:null},
  "8-3":{date:"2025-01-10",nomDoc:null,document:null},"8-4":{date:"2025-01-10",nomDoc:null,document:null},
  "8-5":{date:"2025-01-10",nomDoc:null,document:null},
};
const INIT_FORMATIONS=[
  {id:1,titre:"Sauveteur Secouriste du Travail (SST)",categorie:"Securite",dureeValidite:24,employes:[1,2,3,4,5],obligatoire:true},
  {id:2,titre:"Habilitation electrique B0/H0",categorie:"Securite",dureeValidite:36,employes:[2,3,5],obligatoire:true},
  {id:3,titre:"CACES R482 - Engins de chantier",categorie:"Technique",dureeValidite:60,employes:[3],obligatoire:true},
  {id:4,titre:"Certiphyto Operateur",categorie:"Phytosanitaire",dureeValidite:60,employes:[4,2],obligatoire:true},
  {id:5,titre:"Port des EPI - Tronconneuse",categorie:"Securite",dureeValidite:12,employes:[1,2,3],obligatoire:true},
  {id:6,titre:"Travaux en hauteur / Nacelle",categorie:"Securite",dureeValidite:36,employes:[1,2,3],obligatoire:false},
  {id:7,titre:"Gestes et Postures (TMS)",categorie:"Sante",dureeValidite:24,employes:[1,2,3,4,5],obligatoire:false},
  {id:8,titre:"Sensibilisation environnement MASE",categorie:"Environnement",dureeValidite:12,employes:[1,2,3,4,5],obligatoire:true},
];
const INIT_MODES=[
  {id:1,ref:"MO-001",titre:"Utilisation debroussailleuse thermique",poste:["Ouvrier Espaces Verts","Chef d'equipe"],
   lignes:[
    {operation:"Preparation du materiel",moyens:"Debroussailleuse thermique, carburant, huile",risques:"Fuite carburant, incendie",prevention:"Verifier les niveaux, pas de fuite"},
    {operation:"Mise en route",moyens:"Demarreur manuel, EPI complets",risques:"Projection, bruit excessif",prevention:"Distance > 15m des tiers, casque anti-bruit"},
    {operation:"Travaux de coupe",moyens:"Tete de coupe, fil nylon ou lame",risques:"Projection d'objets, coupure",prevention:"Visiere obligatoire, zone balisee"},
    {operation:"Deplacement avec l'outil",moyens:"Protection de lame, moteur coupe",risques:"Coupure accidentelle",prevention:"Moteur coupe si deplacement > 10m"},
    {operation:"Nettoyage et rangement",moyens:"Chiffon, graisse, housse de protection",risques:"Brulure (moteur chaud)",prevention:"Attendre refroidissement avant nettoyage"},
  ]},
  {id:2,ref:"MO-002",titre:"Application herbicide",poste:["Applicateur phyto"],
   lignes:[
    {operation:"Verification meteo",moyens:"Application meteo, anemometre",risques:"Derive produit, contamination",prevention:"Vent < 3 Beaufort, pas de pluie prevue"},
    {operation:"Preparation du melange",moyens:"Cuve, eau, produit homologue",risques:"Contact chimique, projection",prevention:"EPI complets : gants nitrile, lunettes, masque"},
    {operation:"Application",moyens:"Rampe, lance de traitement",risques:"Inhalation, contamination sol/eau",prevention:"Respecter doses homologuees, distance riverains 5m"},
    {operation:"Rincage du materiel",moyens:"Eau claire x3, aire etanche",risques:"Pollution environnementale",prevention:"Triple rincage, eau de rincage epandue sur zone traitee"},
    {operation:"Tracabilite",moyens:"Registre phytosanitaire",risques:"Non-conformite reglementaire",prevention:"Remplir le registre immediatement apres intervention"},
  ]},
];
const INIT_HSE_DOCS=[
  {id:1,titre:"Livret d'accueil Securite",type:"Livret",categorie:"Securite",date:"2025-01-15",poste:"Tous",description:"Document remis a tout nouvel entrant",document:null,nomDoc:null,mimeType:null},
  {id:2,titre:"Document Unique (DUERP)",type:"Reglementaire",categorie:"Securite",date:"2025-03-01",poste:"Encadrement",description:"Evaluation des risques professionnels",document:null,nomDoc:null,mimeType:null},
  {id:3,titre:"Reglement Interieur",type:"Reglementaire",categorie:"General",date:"2024-09-01",poste:"Tous",description:"",document:null,nomDoc:null,mimeType:null},
  {id:4,titre:"FDS Herbicides",type:"FDS",categorie:"Phytosanitaire",date:"2025-02-10",poste:"Applicateur phyto",description:"Fiche de donnees de securite produits",document:null,nomDoc:null,mimeType:null},
  {id:5,titre:"Procedure urgence et accidents",type:"Procedure",categorie:"Securite",date:"2025-01-15",poste:"Tous",description:"A afficher dans chaque vehicule",document:null,nomDoc:null,mimeType:null},
  {id:6,titre:"Charte environnement MASE",type:"Charte",categorie:"Environnement",date:"2025-01-15",poste:"Tous",description:"",document:null,nomDoc:null,mimeType:null},
  {id:7,titre:"Politique HSE de l'entreprise",type:"Politique",categorie:"HSE",date:"2025-01-01",poste:"Tous",description:"",document:null,nomDoc:null,mimeType:null},
];
const INIT_DOC_CATS=["Securite","Sante","Phytosanitaire","Environnement","HSE","General","Reglementaire","Formation","EPI","Urgence"];
const FORM_CATS=["Securite","Sante","Technique","Phytosanitaire","Environnement","Management"];
const MED_TYPES=["Visite periodique","Visite d'embauche","Visite de reprise","Surveillance renforcee","Visite spontanee"];
const APTITUDES=["Apte","Apte avec reserves","Inapte temporaire","Inapte definitif"];
const EPI_TYPES=["Casque","Lunettes / Visiere","Protege-oreilles","Gants anti-coupure","Gants nitrile","Chaussures S3","Gilet haute visibilite","Harnais","Masque FFP2/FFP3","Combinaison","Jambieres protection","Bottes"];
const HABL_TYPES=["Habilitation electrique B0","Habilitation electrique H0","CACES R482 Cat. A","CACES R482 Cat. B1","CACES R482 Cat. F","CACES R486 Cat. B","Travaux en hauteur","Certiphyto Operateur","Certiphyto Decideur","AIPR Operateur"];
const ADMIN_PASS="Admin2025";

function getExpiry(ds,months){const d=new Date(ds);d.setMonth(d.getMonth()+months);return d;}
function fStatus(fid,eid,duree,dates){
  const fd=dates[`${fid}-${eid}`];
  if(!fd||!fd.date)return{s:"non",label:"Non realise",color:"#ef4444",bg:"#fee2e2"};
  const exp=getExpiry(fd.date,duree),diff=Math.round((exp-new Date())/86400000);
  if(diff<0)return{s:"exp",label:"Expire",color:"#ef4444",bg:"#fee2e2",exp};
  if(diff<90)return{s:"soon",label:`${diff}j`,color:"#f59e0b",bg:"#fef3c7",exp};
  return{s:"ok",label:"A jour",color:"#16a34a",bg:"#dcfce7",exp};
}
function dStatus(nextDate){
  if(!nextDate)return{label:"Non planifiee",color:"#9ca3af",bg:"#f3f4f6"};
  const diff=Math.round((new Date(nextDate)-new Date())/86400000);
  if(diff<0)return{label:"Depassee",color:"#ef4444",bg:"#fee2e2"};
  if(diff<60)return{label:`Dans ${diff}j`,color:"#f59e0b",bg:"#fef3c7"};
  return{label:new Date(nextDate).toLocaleDateString("fr-FR"),color:"#16a34a",bg:"#dcfce7"};
}
function epiStatus(dateExp){
  if(!dateExp)return{label:"--",color:"#9ca3af",bg:"#f3f4f6"};
  const diff=Math.round((new Date(dateExp)-new Date())/86400000);
  if(diff<0)return{label:"Expire",color:"#ef4444",bg:"#fee2e2"};
  if(diff<60)return{label:`${diff}j restants`,color:"#f59e0b",bg:"#fef3c7"};
  return{label:new Date(dateExp).toLocaleDateString("fr-FR"),color:"#16a34a",bg:"#dcfce7"};
}
function ini(n){return n.split(" ").map(w=>w[0]).join("").toUpperCase().slice(0,2);}
async function toB64(file){return new Promise(res=>{const r=new FileReader();r.onload=e=>res(e.target.result);r.readAsDataURL(file);});}
async function resizeImg(file){return new Promise(res=>{const r=new FileReader();r.onload=e=>{const img=new Image();img.onload=()=>{const c=document.createElement("canvas");c.width=120;c.height=120;const ctx=c.getContext("2d");const size=Math.min(img.width,img.height);ctx.drawImage(img,(img.width-size)/2,(img.height-size)/2,size,size,0,0,120,120);res(c.toDataURL("image/jpeg",0.7));};img.src=e.target.result;};r.readAsDataURL(file);});}
function downloadFile(data,name){const a=document.createElement("a");a.href=data;a.download=name;a.click();}
function fmtDate(ds){if(!ds)return"--";return new Date(ds).toLocaleDateString("fr-FR");}

function Badge({color,bg,children}){return <span className="badge" style={{color,background:bg}}>{children}</span>;}
function Bdg({s}){return <Badge color={s.color} bg={s.bg}>{s.label}</Badge>;}
function Fld({label,value,onChange,type="text",placeholder=""}){
  return <div style={{marginBottom:12}}>
    {label&&<label className="label">{label}</label>}
    <input className="input" type={type} value={value||""} onChange={onChange} placeholder={placeholder}/>
  </div>;
}
function FldSel({label,value,onChange,options}){
  return <div style={{marginBottom:12}}>
    {label&&<label className="label">{label}</label>}
    <select className="input" value={value||""} onChange={onChange}>
      {options.map(o=><option key={o.value||o} value={o.value||o}>{o.label||o}</option>)}
    </select>
  </div>;
}
function FldArea({label,value,onChange,placeholder="",rows=3}){
  return <div style={{marginBottom:12}}>
    {label&&<label className="label">{label}</label>}
    <textarea className="input" value={value||""} onChange={onChange} placeholder={placeholder} rows={rows} style={{resize:"vertical"}}/>
  </div>;
}
function Avatar({emp,size=44}){
  return <div style={{width:size,height:size,borderRadius:size/4,flexShrink:0,overflow:"hidden",background:"linear-gradient(135deg,#14532d,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center"}}>
    {emp.photo?<img src={emp.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{color:"#fff",fontWeight:800,fontSize:size*.3}}>{ini(emp.nom)}</span>}
  </div>;
}
function Modal({title,onClose,children,wide=false}){
  return <div className="modal-overlay" onClick={e=>{if(e.target===e.currentTarget)onClose();}}>
    <div className="modal-box" style={{maxWidth:wide?900:680}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
        <h3 style={{fontSize:18,fontWeight:800,color:"#1a2216",fontFamily:"'Fraunces',Georgia,serif"}}>{title}</h3>
        <button onClick={onClose} style={{background:"#f0f2ee",border:"none",borderRadius:10,width:34,height:34,cursor:"pointer",fontSize:20,display:"flex",alignItems:"center",justifyContent:"center"}}>x</button>
      </div>
      {children}
    </div>
  </div>;
}
function FileBtn({onFile,children}){
  const ref=useRef();
  return <>
    <input ref={ref} type="file" accept="*" style={{display:"none"}} onChange={async e=>{if(e.target.files[0]){const b=await toB64(e.target.files[0]);onFile(b,e.target.files[0].name,e.target.files[0].type);}e.target.value="";}}/>
    <button className="btn-secondary" style={{fontSize:12}} onClick={()=>ref.current.click()}>{children||"Joindre fichier"}</button>
  </>;
}
function DocViewer({doc,nom,onClose}){
  if(!doc)return null;
  const isPdf=nom&&nom.toLowerCase().endsWith(".pdf");
  const isImg=doc.startsWith("data:image");
  return <Modal title={nom||"Document"} onClose={onClose} wide>
    {isPdf&&<iframe src={doc} style={{width:"100%",height:"70vh",border:"none",borderRadius:10}}/>}
    {isImg&&<img src={doc} style={{width:"100%",maxHeight:"70vh",objectFit:"contain",borderRadius:10}} alt={nom}/>}
    {!isPdf&&!isImg&&<div style={{padding:40,textAlign:"center",color:"#6b7280"}}>
      <div style={{fontSize:40,marginBottom:10}}>document</div>
      <div style={{marginBottom:16}}>Apercu non disponible.</div>
      <button className="btn-primary" onClick={()=>downloadFile(doc,nom||"document")}>Telecharger</button>
    </div>}
    <div style={{marginTop:16,display:"flex",gap:10}}>
      <button className="btn-primary" onClick={()=>downloadFile(doc,nom||"document")}>Telecharger</button>
      <button className="btn-secondary" onClick={onClose}>Fermer</button>
    </div>
  </Modal>;
}
function SectionHdr({icon,title,action}){
  return <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:18}}>
    <div style={{display:"flex",alignItems:"center",gap:10}}>
      <span style={{fontSize:22}}>{icon}</span>
      <h2 style={{fontSize:20,fontWeight:800,color:"#1a2216",fontFamily:"'Fraunces',Georgia,serif"}}>{title}</h2>
    </div>
    {action&&<div>{action}</div>}
  </div>;
}
function Tabs({tabs,active,onChange}){
  return <div style={{display:"flex",gap:6,marginBottom:20,borderBottom:"2px solid #e5e7eb",paddingBottom:0}}>
    {tabs.map(([k,l])=><button key={k} onClick={()=>onChange(k)} style={{padding:"8px 16px",border:"none",background:"none",cursor:"pointer",fontWeight:700,fontSize:13,color:active===k?"#14532d":"#6b7280",borderBottom:active===k?"2px solid #14532d":"2px solid transparent",marginBottom:-2,borderRadius:"4px 4px 0 0"}}>{l}</button>)}
  </div>;
}

function Login({onAdmin,onSalarie}){
  const [showAdmin,setShowAdmin]=useState(false);
  const [pass,setPass]=useState("");
  const [err,setErr]=useState("");
  const tryAdmin=()=>pass===ADMIN_PASS?onAdmin():setErr("Mot de passe incorrect.");
  return <div style={{minHeight:"100vh",background:"linear-gradient(160deg,#052e16,#14532d 60%,#166534)",display:"flex",alignItems:"center",justifyContent:"center",padding:20}}>
    <div style={{maxWidth:440,width:"100%"}}>
      <div style={{textAlign:"center",marginBottom:40}}>
        <div style={{fontSize:56,marginBottom:12}}>&#127807;</div>
        <div style={{color:"#86efac",fontSize:12,fontWeight:700,letterSpacing:4,marginBottom:8}}>REFERENTIEL MASE</div>
        <h1 style={{color:"#fff",fontSize:32,fontWeight:900,fontFamily:"'Fraunces',Georgia,serif",lineHeight:1.1}}>Espace Securite</h1>
        <p style={{color:"#bbf7d0",marginTop:8,fontSize:14}}>Sante - Securite - Environnement</p>
      </div>
      {!showAdmin?<div style={{display:"flex",flexDirection:"column",gap:14}}>
        <button onClick={onSalarie} style={{background:"rgba(255,255,255,0.12)",backdropFilter:"blur(8px)",border:"1.5px solid rgba(255,255,255,0.2)",borderRadius:16,padding:"20px 24px",cursor:"pointer",color:"#fff",display:"flex",alignItems:"center",gap:16,textAlign:"left"}}>
          <span style={{fontSize:32}}>&#128119;</span>
          <div><div style={{fontSize:16,fontWeight:700}}>Espace Salarie</div><div style={{fontSize:12,opacity:.7,marginTop:2}}>Consulter mes informations et documents</div></div>
        </button>
        <button onClick={()=>setShowAdmin(true)} style={{background:"rgba(255,255,255,0.07)",backdropFilter:"blur(8px)",border:"1.5px solid rgba(255,255,255,0.12)",borderRadius:16,padding:"20px 24px",cursor:"pointer",color:"#d1fae5",display:"flex",alignItems:"center",gap:16,textAlign:"left"}}>
          <span style={{fontSize:32}}>&#128737;</span>
          <div><div style={{fontSize:16,fontWeight:700}}>Espace Administrateur</div><div style={{fontSize:12,opacity:.7,marginTop:2}}>Gestion complete MASE</div></div>
        </button>
      </div>:<div style={{background:"rgba(255,255,255,0.1)",borderRadius:20,padding:28,backdropFilter:"blur(8px)"}}>
        <div style={{color:"#fff",fontWeight:800,fontSize:17,marginBottom:6}}>Connexion Administrateur</div>
        <div style={{color:"#86efac",fontSize:11,marginBottom:18}}>Indice : Admin + annee en cours</div>
        <input type="password" value={pass} onChange={e=>{setPass(e.target.value);setErr("");}} onKeyDown={e=>e.key==="Enter"&&tryAdmin()} placeholder="Mot de passe" style={{width:"100%",padding:"12px 16px",borderRadius:12,border:err?"1.5px solid #f87171":"1.5px solid rgba(255,255,255,0.2)",background:"rgba(255,255,255,0.1)",color:"#fff",fontSize:14,outline:"none",boxSizing:"border-box",marginBottom:8}}/>
        {err&&<div style={{color:"#fca5a5",fontSize:12,marginBottom:8}}>{err}</div>}
        <div style={{display:"flex",gap:10,marginTop:4}}>
          <button className="btn-secondary" style={{flex:1}} onClick={()=>{setShowAdmin(false);setErr("");}}>Retour</button>
          <button className="btn-primary" style={{flex:1}} onClick={tryAdmin}>Connexion</button>
        </div>
      </div>}
    </div>
  </div>;
}

function Dashboard({employees,formations,formDates,medVisits,epiData,hablData,setPage,setSelEmp,isAdmin}){
  const alerts=[];
  employees.forEach(emp=>{
    formations.filter(f=>f.employes.includes(emp.id)).forEach(f=>{
      const s=fStatus(f.id,emp.id,f.dureeValidite,formDates);
      if(s.s==="exp"||s.s==="non")alerts.push({type:"danger",nom:emp.nom,label:f.titre,status:s.label});
      else if(s.s==="soon")alerts.push({type:"warn",nom:emp.nom,label:f.titre,status:s.label});
    });
    (medVisits[emp.id]||[]).forEach(v=>{const s=dStatus(v.prochaine);if(s.label==="Depassee")alerts.push({type:"danger",nom:emp.nom,label:"Visite "+v.type,status:"Depassee"});});
    (epiData[emp.id]||[]).forEach(e=>{const s=epiStatus(e.dateExpiration);if(s.label==="Expire")alerts.push({type:"danger",nom:emp.nom,label:"EPI : "+e.nom,status:"Expire"});});
    (hablData[emp.id]||[]).forEach(h=>{const s=epiStatus(h.dateExpiration);if(s.label==="Expire")alerts.push({type:"danger",nom:emp.nom,label:"Habilitation : "+h.nom,status:"Expiree"});});
  });
  const dangers=alerts.filter(a=>a.type==="danger");
  const statCards=[{l:"Salaries",v:employees.length,i:"&#128119;",c:"#eff6ff",t:"#1d4ed8"},{l:"Formations",v:formations.length,i:"&#127891;",c:"#f0fdf4",t:"#15803d"},{l:"Alertes",v:alerts.length,i:"&#9888;",c:alerts.length>0?"#fff7ed":"#f9fafb",t:alerts.length>0?"#d97706":"#6b7280"},{l:"Critiques",v:dangers.length,i:"&#128680;",c:dangers.length>0?"#fef2f2":"#f9fafb",t:dangers.length>0?"#dc2626":"#6b7280"}];
  return <div>
    <div style={{marginBottom:24}}>
      <h1 style={{fontSize:26,fontWeight:900,color:"#1a2216",fontFamily:"'Fraunces',serif",marginBottom:4}}>Tableau de bord</h1>
      <p style={{color:"#6b7280",fontSize:14}}>Referentiel MASE - Espaces verts</p>
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:14,marginBottom:24}}>
      {statCards.map(s=><div key={s.l} className="card" style={{background:s.c,boxShadow:"none",padding:"18px 20px"}}>
        <div style={{fontSize:28,marginBottom:6}} dangerouslySetInnerHTML={{__html:s.i}}/>
        <div style={{fontSize:28,fontWeight:900,color:s.t,fontFamily:"'Fraunces',serif"}}>{s.v}</div>
        <div style={{fontSize:12,fontWeight:600,color:s.t,opacity:.8}}>{s.l}</div>
      </div>)}
    </div>
    {alerts.length>0&&<div className="card" style={{border:`1.5px solid ${dangers.length>0?"#fca5a5":"#fde68a"}`,marginBottom:20}}>
      <div style={{fontWeight:800,fontSize:15,color:dangers.length>0?"#dc2626":"#d97706",marginBottom:12}}>{dangers.length>0?"URGENT":"ATTENTION"} - {alerts.length} alerte(s)</div>
      <table className="table"><thead><tr><th>Salarie</th><th>Element</th><th>Statut</th></tr></thead>
      <tbody>{alerts.slice(0,8).map((a,i)=><tr key={i}><td style={{fontWeight:600}}>{a.nom}</td><td style={{color:"#6b7280"}}>{a.label.length>50?a.label.slice(0,50)+"...":a.label}</td><td><Badge color={a.type==="danger"?"#dc2626":"#d97706"} bg={a.type==="danger"?"#fee2e2":"#fef3c7"}>{a.status}</Badge></td></tr>)}</tbody>
      </table>
    </div>}
    <div className="card">
      <div style={{fontWeight:800,fontSize:15,color:"#1a2216",marginBottom:14}}>Equipe ({employees.length} salaries)</div>
      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(200px,1fr))",gap:10}}>
        {employees.map(emp=>{
          const ea=alerts.filter(a=>a.nom===emp.nom);
          const d=ea.filter(a=>a.type==="danger").length,w=ea.filter(a=>a.type==="warn").length;
          return <div key={emp.id} onClick={()=>{setSelEmp(emp.id);setPage("employe");}} style={{background:"#f8faf6",borderRadius:12,padding:"14px",cursor:"pointer",border:"1.5px solid #e5e7eb",display:"flex",alignItems:"center",gap:12}}>
            <Avatar emp={emp} size={40}/>
            <div style={{flex:1,minWidth:0}}>
              <div style={{fontWeight:700,fontSize:13,color:"#1a2216",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{emp.nom}</div>
              <div style={{fontSize:11,color:"#6b7280"}}>{emp.poste.split(" ").slice(0,2).join(" ")}</div>
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:3,alignItems:"flex-end"}}>
              {d>0&&<Badge color="#dc2626" bg="#fee2e2">{d} urgent</Badge>}
              {w>0&&<Badge color="#d97706" bg="#fef3c7">{w} attention</Badge>}
              {d===0&&w===0&&<Badge color="#16a34a" bg="#dcfce7">OK</Badge>}
            </div>
          </div>;
        })}
      </div>
    </div>
  </div>;
}

function InfoPerso({emp,isAdmin,onSave}){
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({...(emp.infoPerso||{})});
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const ip=emp.infoPerso||{};
  if(editing&&isAdmin)return <div className="card">
    <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>Modifier les informations personnelles</div>
    <div className="split"><Fld label="Adresse" value={form.adresse} onChange={set("adresse")}/><Fld label="Contact urgence - Nom" value={form.urgenceNom} onChange={set("urgenceNom")}/></div>
    <div className="split"><Fld label="Contact urgence - Tel." value={form.urgenceTel} onChange={set("urgenceTel")}/><FldSel label="Groupe sanguin" value={form.groupeSanguin} onChange={set("groupeSanguin")} options={["--","A+","A-","B+","B-","AB+","AB-","O+","O-"]}/></div>
    <div className="split"><Fld label="Taille vetements" value={form.taille} onChange={set("taille")} placeholder="S/M/L/XL"/><Fld label="Pointure chaussures" value={form.pointure} onChange={set("pointure")} placeholder="42"/></div>
    <FldArea label="Notes medicales / restrictions" value={form.notes} onChange={set("notes")}/>
    <div style={{display:"flex",gap:10,marginTop:8}}>
      <button className="btn-secondary" onClick={()=>setEditing(false)}>Annuler</button>
      <button className="btn-primary" onClick={()=>{onSave({...emp,infoPerso:{...ip,...form}});setEditing(false);}}>Enregistrer</button>
    </div>
  </div>;
  return <div className="card">
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
      <div style={{fontWeight:700,fontSize:15}}>Informations personnelles</div>
      {isAdmin&&<button className="btn-secondary" style={{fontSize:12}} onClick={()=>{setForm({...ip});setEditing(true);}}>Modifier</button>}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:20}}>
      {[["Email",emp.email],["Telephone",emp.tel],["Date d'entree",fmtDate(emp.dateEntree)],["Adresse",ip.adresse],["Contact urgence",ip.urgenceNom?(ip.urgenceNom+(ip.urgenceTel?" - "+ip.urgenceTel:"")):"--"],["Groupe sanguin",ip.groupeSanguin||"--"],["Taille vetements",ip.taille||"--"],["Pointure",ip.pointure||"--"],["Notes",ip.notes||"--"]].map(([l,v])=><div key={l}>
        <div style={{fontSize:11,fontWeight:700,color:"#9ca3af",marginBottom:3}}>{l}</div>
        <div style={{fontSize:13,color:"#374151",fontWeight:500}}>{v||"--"}</div>
      </div>)}
    </div>
  </div>;
}

function EmpFormations({emp,formations,formDates,onSave,isAdmin,onView}){
  const [editF,setEditF]=useState(null);
  if(formations.length===0)return <div className="card" style={{textAlign:"center",color:"#6b7280"}}>Aucune formation assignee.</div>;
  return <div>
    {editF&&<FormDateEditModal formation={editF} emp={emp} formDates={formDates} onSave={d=>{onSave(d);setEditF(null);}} onClose={()=>setEditF(null)}/>}
    <table className="table" style={{background:"#fff",borderRadius:14,overflow:"hidden"}}>
      <thead><tr><th>Formation</th><th>Categorie</th><th>Validite</th><th>Realisee le</th><th>Echeance</th><th>Attestation</th>{isAdmin&&<th>Action</th>}</tr></thead>
      <tbody>{formations.map(f=>{
        const s=fStatus(f.id,emp.id,f.dureeValidite,formDates);
        const fd=formDates[`${f.id}-${emp.id}`]||{};
        return <tr key={f.id}>
          <td><div style={{fontWeight:600,fontSize:13}}>{f.titre}</div>{f.obligatoire&&<Badge color="#7c3aed" bg="#f3e8ff">Obligatoire</Badge>}</td>
          <td><Badge color="#1d4ed8" bg="#eff6ff">{f.categorie}</Badge></td>
          <td style={{color:"#6b7280"}}>{f.dureeValidite} mois</td>
          <td>{fd.date?fmtDate(fd.date):"--"}</td>
          <td><Bdg s={s}/></td>
          <td>{fd.document?<div style={{display:"flex",gap:6}}>
            <button className="btn-ghost" style={{fontSize:11}} onClick={()=>onView({doc:fd.document,nom:fd.nomDoc})}>Voir</button>
            <button className="btn-ghost" style={{fontSize:11}} onClick={()=>downloadFile(fd.document,fd.nomDoc)}>Telecharger</button>
          </div>:<span style={{color:"#9ca3af",fontSize:12}}>--</span>}</td>
          {isAdmin&&<td><button className="btn-ghost" style={{fontSize:11}} onClick={()=>setEditF(f)}>Modifier</button></td>}
        </tr>;
      })}</tbody>
    </table>
  </div>;
}

function FormDateEditModal({formation,emp,formDates,onSave,onClose}){
  const key=`${formation.id}-${emp.id}`;
  const cur=formDates[key]||{};
  const [date,setDate]=useState(cur.date||"");
  const [doc,setDoc]=useState(cur.document||null);
  const [nom,setNom]=useState(cur.nomDoc||null);
  return <Modal title={formation.titre} onClose={onClose}>
    <div style={{marginBottom:8,color:"#6b7280",fontSize:13}}>{formation.categorie} - Validite {formation.dureeValidite} mois - {emp.nom}</div>
    <Fld label="Date de realisation" value={date} onChange={e=>setDate(e.target.value)} type="date"/>
    <div style={{marginBottom:12}}>
      <label className="label">Attestation / Certificat</label>
      <div style={{display:"flex",gap:10,alignItems:"center"}}>
        <FileBtn onFile={(b,n)=>{setDoc(b);setNom(n);}}>Joindre attestation</FileBtn>
        {doc&&<div style={{display:"flex",gap:6,alignItems:"center"}}>
          <span style={{fontSize:12,color:"#15803d",fontWeight:600}}>{nom}</span>
          <button className="btn-danger" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>{setDoc(null);setNom(null);}}>x</button>
        </div>}
      </div>
    </div>
    <div style={{display:"flex",gap:10,marginTop:16}}>
      <button className="btn-secondary" onClick={onClose}>Annuler</button>
      <button className="btn-primary" onClick={()=>onSave({...formDates,[key]:{date,document:doc,nomDoc:nom}})}>Enregistrer</button>
    </div>
  </Modal>;
}

function EmpEpi({emp,epi,onSave,isAdmin}){
  const [showForm,setShowForm]=useState(false);
  const [editIdx,setEditIdx]=useState(null);
  const empty={nom:"",reference:"",taille:"",dateAttribution:"",dateExpiration:""};
  const [form,setForm]=useState(empty);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const save=()=>{if(!form.nom)return;const updated=editIdx!==null?epi.map((e,i)=>i===editIdx?form:e):[...epi,form];onSave(updated);setShowForm(false);setEditIdx(null);setForm(empty);};
  const del=i=>onSave(epi.filter((_,idx)=>idx!==i));
  return <div>
    {isAdmin&&<div style={{marginBottom:14}}><button className="btn-primary" onClick={()=>{setForm(empty);setEditIdx(null);setShowForm(true);}}>+ Ajouter un EPI</button></div>}
    {showForm&&<div className="card" style={{marginBottom:14,border:"1.5px solid #bbf7d0"}}>
      <div style={{fontWeight:700,marginBottom:12}}>{editIdx!==null?"Modifier l'EPI":"Nouvel EPI"}</div>
      <div className="split"><FldSel label="Type d'EPI" value={form.nom} onChange={set("nom")} options={["",...EPI_TYPES]}/><Fld label="Reference / Marque" value={form.reference} onChange={set("reference")} placeholder="Ex: Uvex 9301"/></div>
      <div className="split"><Fld label="Taille / Pointure" value={form.taille} onChange={set("taille")} placeholder="Ex: 42 / L"/><Fld label="Date d'attribution" value={form.dateAttribution} onChange={set("dateAttribution")} type="date"/></div>
      <Fld label="Date d'expiration / Remplacement prevu" value={form.dateExpiration} onChange={set("dateExpiration")} type="date"/>
      <div style={{display:"flex",gap:10}}><button className="btn-secondary" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn-primary" onClick={save}>Enregistrer</button></div>
    </div>}
    {epi.length===0?<div className="card" style={{textAlign:"center",color:"#6b7280"}}>Aucun EPI enregistre.</div>:
    <table className="table" style={{background:"#fff",borderRadius:14,overflow:"hidden"}}>
      <thead><tr><th>EPI</th><th>Reference</th><th>Taille</th><th>Attribution</th><th>Expiration</th>{isAdmin&&<th>Actions</th>}</tr></thead>
      <tbody>{epi.map((e,i)=>{const s=epiStatus(e.dateExpiration);return <tr key={i}>
        <td style={{fontWeight:600}}>{e.nom}</td>
        <td style={{color:"#6b7280"}}>{e.reference||"--"}</td>
        <td>{e.taille||"--"}</td>
        <td>{e.dateAttribution?fmtDate(e.dateAttribution):"--"}</td>
        <td><Bdg s={s}/></td>
        {isAdmin&&<td><div style={{display:"flex",gap:6}}>
          <button className="btn-ghost" style={{fontSize:11}} onClick={()=>{setForm({...e});setEditIdx(i);setShowForm(true);}}>Modifier</button>
          <button className="btn-danger" style={{fontSize:11}} onClick={()=>del(i)}>Suppr</button>
        </div></td>}
      </tr>;})}
      </tbody>
    </table>}
  </div>;
}

function EmpHabl({emp,habl,onSave,isAdmin,onView}){
  const [showForm,setShowForm]=useState(false);
  const [editIdx,setEditIdx]=useState(null);
  const empty={nom:"",organisme:"",dateObtention:"",dateExpiration:"",document:null,nomDoc:null};
  const [form,setForm]=useState(empty);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const save=()=>{if(!form.nom)return;const updated=editIdx!==null?habl.map((h,i)=>i===editIdx?form:h):[...habl,form];onSave(updated);setShowForm(false);setEditIdx(null);setForm(empty);};
  const del=i=>onSave(habl.filter((_,idx)=>idx!==i));
  return <div>
    {isAdmin&&<div style={{marginBottom:14}}><button className="btn-primary" onClick={()=>{setForm(empty);setEditIdx(null);setShowForm(true);}}>+ Ajouter une habilitation</button></div>}
    {showForm&&<div className="card" style={{marginBottom:14,border:"1.5px solid #e9d5ff"}}>
      <div style={{fontWeight:700,marginBottom:12}}>{editIdx!==null?"Modifier":"Nouvelle habilitation"}</div>
      <div className="split"><FldSel label="Habilitation" value={form.nom} onChange={set("nom")} options={["",...HABL_TYPES]}/><Fld label="Organisme" value={form.organisme} onChange={set("organisme")} placeholder="Ex: APAVE"/></div>
      <div className="split"><Fld label="Date d'obtention" value={form.dateObtention} onChange={set("dateObtention")} type="date"/><Fld label="Date d'expiration" value={form.dateExpiration} onChange={set("dateExpiration")} type="date"/></div>
      <div style={{marginBottom:12}}>
        <label className="label">Document justificatif</label>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <FileBtn onFile={(b,n)=>setForm(f=>({...f,document:b,nomDoc:n}))}>Joindre document</FileBtn>
          {form.document&&<div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:12,color:"#7c3aed",fontWeight:600}}>{form.nomDoc}</span><button className="btn-danger" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>setForm(f=>({...f,document:null,nomDoc:null}))}>x</button></div>}
        </div>
      </div>
      <div style={{display:"flex",gap:10}}><button className="btn-secondary" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn-primary" onClick={save}>Enregistrer</button></div>
    </div>}
    {habl.length===0?<div className="card" style={{textAlign:"center",color:"#6b7280"}}>Aucune habilitation enregistree.</div>:
    <table className="table" style={{background:"#fff",borderRadius:14,overflow:"hidden"}}>
      <thead><tr><th>Habilitation</th><th>Organisme</th><th>Obtenue le</th><th>Expiration</th><th>Document</th>{isAdmin&&<th>Actions</th>}</tr></thead>
      <tbody>{habl.map((h,i)=>{const s=epiStatus(h.dateExpiration);return <tr key={i}>
        <td style={{fontWeight:600}}>{h.nom}</td>
        <td style={{color:"#6b7280"}}>{h.organisme||"--"}</td>
        <td>{h.dateObtention?fmtDate(h.dateObtention):"--"}</td>
        <td><Bdg s={s}/></td>
        <td>{h.document?<div style={{display:"flex",gap:6}}>
          <button className="btn-ghost" style={{fontSize:11}} onClick={()=>onView({doc:h.document,nom:h.nomDoc})}>Voir</button>
          <button className="btn-ghost" style={{fontSize:11}} onClick={()=>downloadFile(h.document,h.nomDoc)}>Telecharger</button>
        </div>:<span style={{color:"#9ca3af",fontSize:12}}>--</span>}</td>
        {isAdmin&&<td><div style={{display:"flex",gap:6}}>
          <button className="btn-ghost" style={{fontSize:11}} onClick={()=>{setForm({...h});setEditIdx(i);setShowForm(true);}}>Modifier</button>
          <button className="btn-danger" style={{fontSize:11}} onClick={()=>del(i)}>Suppr</button>
        </div></td>}
      </tr>;})}
      </tbody>
    </table>}
  </div>;
}

function EmpMedical({emp,med,onSave,isAdmin,onView}){
  const [showForm,setShowForm]=useState(false);
  const [editIdx,setEditIdx]=useState(null);
  const empty={type:"Visite periodique",date:"",prochaine:"",medecin:"",aptitude:"Apte",notes:"",document:null,nomDoc:null};
  const [form,setForm]=useState(empty);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const save=()=>{if(!form.type)return;const updated=editIdx!==null?med.map((v,i)=>i===editIdx?form:v):[...med,form];onSave(updated);setShowForm(false);setEditIdx(null);setForm(empty);};
  const del=i=>onSave(med.filter((_,idx)=>idx!==i));
  return <div>
    {isAdmin&&<div style={{marginBottom:14}}><button className="btn-primary" onClick={()=>{setForm(empty);setEditIdx(null);setShowForm(true);}}>+ Ajouter une visite</button></div>}
    {showForm&&<div className="card" style={{marginBottom:14,border:"1.5px solid #bfdbfe"}}>
      <div style={{fontWeight:700,marginBottom:12}}>{editIdx!==null?"Modifier":"Nouvelle visite medicale"}</div>
      <div className="split"><FldSel label="Type de visite" value={form.type} onChange={set("type")} options={MED_TYPES}/><FldSel label="Aptitude" value={form.aptitude} onChange={set("aptitude")} options={APTITUDES}/></div>
      <div className="split"><Fld label="Date de la visite" value={form.date} onChange={set("date")} type="date"/><Fld label="Prochaine visite" value={form.prochaine} onChange={set("prochaine")} type="date"/></div>
      <Fld label="Medecin du travail" value={form.medecin} onChange={set("medecin")} placeholder="Dr. Nom"/>
      <FldArea label="Notes / Restrictions" value={form.notes} onChange={set("notes")} rows={2}/>
      <div style={{marginBottom:12}}>
        <label className="label">Document (avis d'aptitude...)</label>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <FileBtn onFile={(b,n)=>setForm(f=>({...f,document:b,nomDoc:n}))}>Joindre document</FileBtn>
          {form.document&&<div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:12,color:"#1d4ed8",fontWeight:600}}>{form.nomDoc}</span><button className="btn-danger" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>setForm(f=>({...f,document:null,nomDoc:null}))}>x</button></div>}
        </div>
      </div>
      <div style={{display:"flex",gap:10}}><button className="btn-secondary" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn-primary" onClick={save}>Enregistrer</button></div>
    </div>}
    {med.length===0?<div className="card" style={{textAlign:"center",color:"#6b7280"}}>Aucune visite medicale enregistree.</div>:
    <table className="table" style={{background:"#fff",borderRadius:14,overflow:"hidden"}}>
      <thead><tr><th>Type</th><th>Date</th><th>Medecin</th><th>Aptitude</th><th>Prochaine</th><th>Document</th>{isAdmin&&<th>Actions</th>}</tr></thead>
      <tbody>{med.map((v,i)=>{const s=dStatus(v.prochaine);const ac=v.aptitude==="Apte"?"#16a34a":v.aptitude==="Apte avec reserves"?"#d97706":"#dc2626";return <tr key={i}>
        <td style={{fontWeight:600}}>{v.type}</td>
        <td>{v.date?fmtDate(v.date):"--"}</td>
        <td style={{color:"#6b7280"}}>{v.medecin||"--"}</td>
        <td><Badge color={ac} bg={ac+"22"}>{v.aptitude}</Badge></td>
        <td><Bdg s={s}/></td>
        <td>{v.document?<div style={{display:"flex",gap:6}}>
          <button className="btn-ghost" style={{fontSize:11}} onClick={()=>onView({doc:v.document,nom:v.nomDoc})}>Voir</button>
          <button className="btn-ghost" style={{fontSize:11}} onClick={()=>downloadFile(v.document,v.nomDoc)}>Telecharger</button>
        </div>:<span style={{color:"#9ca3af",fontSize:12}}>--</span>}</td>
        {isAdmin&&<td><div style={{display:"flex",gap:6}}>
          <button className="btn-ghost" style={{fontSize:11}} onClick={()=>{setForm({...v});setEditIdx(i);setShowForm(true);}}>Modifier</button>
          <button className="btn-danger" style={{fontSize:11}} onClick={()=>del(i)}>Suppr</button>
        </div></td>}
      </tr>;})}
      </tbody>
    </table>}
  </div>;
}

function EmpDocs({emp,docs,onSave,isAdmin,onView,docCats}){
  const [showForm,setShowForm]=useState(false);
  const [form,setForm]=useState({titre:"",categorie:docCats[0]||"Autre",date:"",notes:"",document:null,nomDoc:null});
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const save=()=>{if(!form.titre.trim())return;onSave([...docs,form]);setShowForm(false);setForm({titre:"",categorie:docCats[0]||"Autre",date:"",notes:"",document:null,nomDoc:null});};
  const del=i=>onSave(docs.filter((_,idx)=>idx!==i));
  return <div>
    {isAdmin&&<div style={{marginBottom:14}}><button className="btn-primary" onClick={()=>setShowForm(true)}>+ Ajouter un document</button></div>}
    {showForm&&<div className="card" style={{marginBottom:14,border:"1.5px solid #e9d5ff"}}>
      <div style={{fontWeight:700,marginBottom:12}}>Nouveau document salarie</div>
      <div className="split"><Fld label="Titre *" value={form.titre} onChange={set("titre")} placeholder="Ex: Attestation SST"/><FldSel label="Categorie" value={form.categorie} onChange={set("categorie")} options={docCats}/></div>
      <Fld label="Date" value={form.date} onChange={set("date")} type="date"/>
      <FldArea label="Notes" value={form.notes} onChange={set("notes")} rows={2}/>
      <div style={{marginBottom:12}}>
        <label className="label">Fichier joint</label>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <FileBtn onFile={(b,n)=>setForm(f=>({...f,document:b,nomDoc:n}))}>Joindre fichier</FileBtn>
          {form.document&&<div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:12,color:"#7c3aed",fontWeight:600}}>{form.nomDoc}</span><button className="btn-danger" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>setForm(f=>({...f,document:null,nomDoc:null}))}>x</button></div>}
        </div>
      </div>
      <div style={{display:"flex",gap:10}}><button className="btn-secondary" onClick={()=>setShowForm(false)}>Annuler</button><button className="btn-primary" onClick={save}>Enregistrer</button></div>
    </div>}
    {docs.length===0?<div className="card" style={{textAlign:"center",color:"#6b7280"}}>Aucun document personnel.</div>:
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(260px,1fr))",gap:12}}>
      {docs.map((d,i)=><div key={i} className="card" style={{padding:"16px"}}>
        <div style={{fontWeight:700,fontSize:13,color:"#1a2216"}}>{d.titre}</div>
        <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{d.categorie}{d.date?` - ${fmtDate(d.date)}`:""}</div>
        {d.notes&&<div style={{fontSize:11,color:"#9ca3af",marginTop:3}}>{d.notes}</div>}
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
          {d.document&&<><button className="btn-ghost" style={{fontSize:11}} onClick={()=>onView({doc:d.document,nom:d.nomDoc})}>Voir</button><button className="btn-ghost" style={{fontSize:11}} onClick={()=>downloadFile(d.document,d.nomDoc)}>Telecharger</button></>}
          {isAdmin&&<button className="btn-danger" style={{fontSize:11}} onClick={()=>del(i)}>Supprimer</button>}
        </div>
      </div>)}
    </div>}
  </div>;
}

function EmpDetail({emp,formations,formDates,medVisits,empDocs,epiData,hablData,onSaveFormDates,onSaveMed,onSaveDocs,onSaveEpi,onSaveHabl,onSaveEmp,onDeleteEmp,isAdmin,onBack,docCats}){
  const [tab,setTab]=useState("info");
  const [editingEmp,setEditingEmp]=useState(false);
  const [viewDoc,setViewDoc]=useState(null);
  const myForms=formations.filter(f=>f.employes.includes(emp.id));
  const myMed=medVisits[emp.id]||[];
  const myDocs=empDocs[emp.id]||[];
  const myEpi=epiData[emp.id]||[];
  const myHabl=hablData[emp.id]||[];
  return <div>
    {editingEmp&&<EmpEditModal emp={emp} onSave={e=>{onSaveEmp(e);setEditingEmp(false);}} onClose={()=>setEditingEmp(false)}/>}
    {viewDoc&&<DocViewer doc={viewDoc.doc} nom={viewDoc.nom} onClose={()=>setViewDoc(null)}/>}
    <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:20}}>
      <button className="btn-secondary" style={{fontSize:12}} onClick={onBack}>Retour</button>
      <div style={{display:"flex",alignItems:"center",gap:14,flex:1}}>
        <Avatar emp={emp} size={52}/>
        <div>
          <h2 style={{fontFamily:"'Fraunces',serif",fontSize:22,fontWeight:800,color:"#1a2216"}}>{emp.nom}</h2>
          <div style={{fontSize:13,color:"#6b7280"}}>{emp.poste} - {emp.matricule}</div>
        </div>
      </div>
      {isAdmin&&<div style={{display:"flex",gap:8}}>
        <button className="btn-secondary" onClick={()=>setEditingEmp(true)}>Modifier</button>
        <button className="btn-danger" onClick={()=>onDeleteEmp(emp.id)}>Supprimer</button>
      </div>}
    </div>
    <Tabs tabs={[["info","Infos perso"],["formations","Formations"],["epi","EPI"],["habl","Habilitations"],["medical","Medical"],["docs","Documents"]]} active={tab} onChange={setTab}/>
    {tab==="info"&&<InfoPerso emp={emp} isAdmin={isAdmin} onSave={onSaveEmp}/>}
    {tab==="formations"&&<EmpFormations emp={emp} formations={myForms} formDates={formDates} onSave={onSaveFormDates} isAdmin={isAdmin} onView={setViewDoc}/>}
    {tab==="epi"&&<EmpEpi emp={emp} epi={myEpi} onSave={d=>onSaveEpi(emp.id,d)} isAdmin={isAdmin}/>}
    {tab==="habl"&&<EmpHabl emp={emp} habl={myHabl} onSave={d=>onSaveHabl(emp.id,d)} isAdmin={isAdmin} onView={setViewDoc}/>}
    {tab==="medical"&&<EmpMedical emp={emp} med={myMed} onSave={d=>onSaveMed(emp.id,d)} isAdmin={isAdmin} onView={setViewDoc}/>}
    {tab==="docs"&&<EmpDocs emp={emp} docs={myDocs} onSave={d=>onSaveDocs(emp.id,d)} isAdmin={isAdmin} onView={setViewDoc} docCats={docCats}/>}
  </div>;
}

function EmpEditModal({emp,onSave,onClose}){
  const [form,setForm]=useState({nom:emp?.nom||"",poste:emp?.poste||POSTES_LIST[0],matricule:emp?.matricule||"",tel:emp?.tel||"",email:emp?.email||"",dateEntree:emp?.dateEntree||"",photo:emp?.photo||null});
  const fileRef=useRef();
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  return <Modal title={emp?.id?"Modifier le salarie":"Nouveau salarie"} onClose={onClose}>
    <div style={{textAlign:"center",marginBottom:20}}>
      <div onClick={()=>fileRef.current.click()} style={{width:88,height:88,borderRadius:20,margin:"0 auto 10px",overflow:"hidden",background:"linear-gradient(135deg,#14532d,#16a34a)",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer"}}>
        {form.photo?<img src={form.photo} style={{width:"100%",height:"100%",objectFit:"cover"}} alt=""/>:<span style={{color:"#fff",fontWeight:800,fontSize:26}}>{form.nom?ini(form.nom):"+"}</span>}
      </div>
      <input ref={fileRef} type="file" accept="image/*" style={{display:"none"}} onChange={async e=>{if(e.target.files[0]){const p=await resizeImg(e.target.files[0]);setForm(f=>({...f,photo:p}));}}}/>
      <button className="btn-secondary" style={{fontSize:12}} onClick={()=>fileRef.current.click()}>Changer photo</button>
    </div>
    <div className="split"><Fld label="Nom complet *" value={form.nom} onChange={set("nom")} placeholder="Prenom NOM"/><FldSel label="Poste *" value={form.poste} onChange={set("poste")} options={POSTES_LIST}/></div>
    <div className="split"><Fld label="Matricule" value={form.matricule} onChange={set("matricule")} placeholder="OEV-001"/><Fld label="Telephone" value={form.tel} onChange={set("tel")} placeholder="06 XX XX XX XX"/></div>
    <div className="split"><Fld label="Email" value={form.email} onChange={set("email")} type="email"/><Fld label="Date d'entree" value={form.dateEntree} onChange={set("dateEntree")} type="date"/></div>
    <div style={{display:"flex",gap:10,marginTop:8}}>
      <button className="btn-secondary" onClick={onClose}>Annuler</button>
      <button className="btn-primary" onClick={()=>{if(!form.nom.trim())return;onSave({...emp,...form});}}>Enregistrer</button>
    </div>
  </Modal>;
}

function FormationsPage({formations,setFormations,employees,formDates,setFormDates,isAdmin}){
  const [filter,setFilter]=useState("Tous");
  const [showNew,setShowNew]=useState(false);
  const [editForm,setEditForm]=useState(null);
  const cats=["Tous",...FORM_CATS];
  const filtered=filter==="Tous"?formations:formations.filter(f=>f.categorie===filter);
  const emptyF={titre:"",categorie:"Securite",dureeValidite:24,employes:[],obligatoire:true};
  const [newF,setNewF]=useState(emptyF);
  const setNF=k=>e=>setNewF(f=>({...f,[k]:e.target.type==="checkbox"?e.target.checked:e.target.value}));
  const saveNew=()=>{if(!newF.titre.trim())return;setFormations([...formations,{...newF,id:Date.now(),dureeValidite:parseInt(newF.dureeValidite)||24}]);setShowNew(false);setNewF(emptyF);};
  const delForm=id=>setFormations(formations.filter(f=>f.id!==id));
  return <div>
    <SectionHdr icon="&#127891;" title="Gestion des Formations" action={isAdmin&&<button className="btn-primary" onClick={()=>setShowNew(true)}>+ Nouvelle formation</button>}/>
    {showNew&&<div className="card" style={{marginBottom:16,border:"1.5px solid #bbf7d0"}}>
      <div style={{fontWeight:700,marginBottom:14}}>Nouvelle formation</div>
      <div className="split3"><Fld label="Titre *" value={newF.titre} onChange={setNF("titre")} placeholder="Nom de la formation"/><FldSel label="Categorie" value={newF.categorie} onChange={setNF("categorie")} options={FORM_CATS}/><Fld label="Duree validite (mois)" value={newF.dureeValidite} onChange={setNF("dureeValidite")} type="number" placeholder="24"/></div>
      <div style={{marginBottom:12}}><label className="label">Salaries concernes</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{employees.map(e=><label key={e.id} style={{display:"flex",alignItems:"center",gap:5,fontSize:13,cursor:"pointer",padding:"4px 10px",borderRadius:8,background:newF.employes.includes(e.id)?"#dcfce7":"#f3f4f6"}}><input type="checkbox" checked={newF.employes.includes(e.id)} onChange={()=>setNewF(f=>({...f,employes:f.employes.includes(e.id)?f.employes.filter(id=>id!==e.id):[...f.employes,e.id]}))} style={{display:"none"}}/>{e.nom.split(" ")[0]}</label>)}</div></div>
      <label style={{display:"flex",alignItems:"center",gap:8,fontSize:13,cursor:"pointer",marginBottom:12}}><input type="checkbox" checked={newF.obligatoire} onChange={setNF("obligatoire")}/> Formation obligatoire</label>
      <div style={{display:"flex",gap:10}}><button className="btn-secondary" onClick={()=>setShowNew(false)}>Annuler</button><button className="btn-primary" onClick={saveNew}>Creer</button></div>
    </div>}
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      {cats.map(c=><button key={c} className={"tag-filter"+(filter===c?" active":"")} onClick={()=>setFilter(c)}>{c}</button>)}
    </div>
    {filtered.map(form=>{
      const rows=form.employes.map(eid=>({emp:employees.find(e=>e.id===eid),s:fStatus(form.id,eid,form.dureeValidite,formDates)})).filter(x=>x.emp);
      const expired=rows.filter(x=>x.s.s==="exp"||x.s.s==="non").length,warn=rows.filter(x=>x.s.s==="soon").length;
      return <div key={form.id} className="card">
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:12}}>
          <div>
            <div style={{fontWeight:700,fontSize:15,color:"#1a2216"}}>{form.titre}</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:3}}>
              <Badge color="#1d4ed8" bg="#eff6ff">{form.categorie}</Badge>
              <span style={{marginLeft:8}}>Validite {form.dureeValidite} mois</span>
              {form.obligatoire&&<span style={{marginLeft:8}}><Badge color="#7c3aed" bg="#f3e8ff">Obligatoire</Badge></span>}
            </div>
          </div>
          {isAdmin&&<div style={{display:"flex",gap:6}}>
            <button className="btn-ghost" style={{fontSize:11}} onClick={()=>setEditForm(form)}>Affecter</button>
            <button className="btn-danger" style={{fontSize:11}} onClick={()=>delForm(form.id)}>Suppr</button>
          </div>}
        </div>
        <div style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:expired+warn>0?10:0}}>
          {rows.map(({emp,s})=><div key={emp.id} style={{background:s.bg,borderRadius:8,padding:"5px 10px",display:"flex",alignItems:"center",gap:6}}>
            <Avatar emp={emp} size={24}/><div><div style={{fontSize:11,fontWeight:700}}>{emp.nom.split(" ")[0]}</div><div style={{fontSize:10,color:s.color,fontWeight:600}}>{s.label}</div></div>
          </div>)}
        </div>
        {(expired>0||warn>0)&&<div style={{background:expired>0?"#fee2e2":"#fef3c7",borderRadius:8,padding:"6px 12px",fontSize:12,color:expired>0?"#dc2626":"#d97706",fontWeight:700}}>
          {expired>0?`${expired} salarie(s) : action requise`:`${warn} salarie(s) : renouvellement proche`}
        </div>}
      </div>;
    })}
    {editForm&&<AffectFormModal formation={editForm} employees={employees} formDates={formDates} onSaveDate={dates=>setFormDates(d=>({...d,...dates}))} onClose={()=>setEditForm(null)}/>}
  </div>;
}

function AffectFormModal({formation,employees,formDates,onSaveDate,onClose}){
  const relevant=employees.filter(e=>formation.employes.includes(e.id));
  return <Modal title={"Affectation : "+formation.titre} onClose={onClose} wide>
    <div style={{color:"#6b7280",fontSize:13,marginBottom:16}}>{formation.categorie} - Validite {formation.dureeValidite} mois</div>
    <table className="table"><thead><tr><th>Salarie</th><th>Statut</th><th>Date realisation</th></tr></thead>
    <tbody>{relevant.map(emp=>{
      const key=`${formation.id}-${emp.id}`;const fd=formDates[key]||{};const s=fStatus(formation.id,emp.id,formation.dureeValidite,formDates);
      return <tr key={emp.id}>
        <td><div style={{display:"flex",alignItems:"center",gap:8}}><Avatar emp={emp} size={30}/><span style={{fontWeight:600}}>{emp.nom}</span></div></td>
        <td><Bdg s={s}/></td>
        <td><input type="date" value={fd.date||""} onChange={e=>onSaveDate({[key]:{...fd,date:e.target.value}})} className="input" style={{width:150,fontSize:12,padding:"6px 10px"}}/></td>
      </tr>;
    })}</tbody></table>
    <div style={{marginTop:16}}><button className="btn-secondary" onClick={onClose}>Fermer</button></div>
  </Modal>;
}

function ModesPage({modes,setModes,isAdmin}){
  const [selMode,setSelMode]=useState(null);
  const [showNew,setShowNew]=useState(false);
  const emptyM={ref:"",titre:"",poste:[],lignes:[{operation:"",moyens:"",risques:"",prevention:""}]};
  const [newM,setNewM]=useState(emptyM);
  const setNM=k=>e=>setNewM(m=>({...m,[k]:e.target.value}));
  const saveNew=()=>{if(!newM.titre.trim())return;setModes([...modes,{...newM,id:Date.now()}]);setShowNew(false);setNewM(emptyM);};
  const del=id=>setModes(modes.filter(m=>m.id!==id));
  const addLigne=()=>setNewM(m=>({...m,lignes:[...m.lignes,{operation:"",moyens:"",risques:"",prevention:""}]}));
  const setLigne=(i,k,v)=>setNewM(m=>({...m,lignes:m.lignes.map((l,idx)=>idx===i?{...l,[k]:v}:l)}));
  const delLigne=i=>setNewM(m=>({...m,lignes:m.lignes.filter((_,idx)=>idx!==i)}));
  if(selMode){
    const mode=modes.find(m=>m.id===selMode);
    if(!mode){setSelMode(null);return null;}
    return <ModeDetail mode={mode} modes={modes} setModes={setModes} isAdmin={isAdmin} onBack={()=>setSelMode(null)}/>;
  }
  return <div>
    <SectionHdr icon="&#128295;" title="Modes Operatoires" action={isAdmin&&<button className="btn-primary" onClick={()=>setShowNew(true)}>+ Nouveau mode operatoire</button>}/>
    {showNew&&<div className="card" style={{marginBottom:16,border:"1.5px solid #fde68a"}}>
      <div style={{fontWeight:700,marginBottom:14}}>Nouveau mode operatoire</div>
      <div className="split3"><Fld label="Reference" value={newM.ref} onChange={setNM("ref")} placeholder="MO-005"/><Fld label="Titre *" value={newM.titre} onChange={setNM("titre")} placeholder="Nom de l'operation"/><div></div></div>
      <div style={{marginBottom:12}}><label className="label">Postes concernes</label><div style={{display:"flex",gap:8,flexWrap:"wrap"}}>{POSTES_LIST.map(p=><label key={p} style={{display:"flex",alignItems:"center",gap:5,fontSize:12,cursor:"pointer",padding:"4px 10px",borderRadius:8,background:newM.poste.includes(p)?"#fef3c7":"#f3f4f6"}}><input type="checkbox" checked={newM.poste.includes(p)} onChange={()=>setNewM(m=>({...m,poste:m.poste.includes(p)?m.poste.filter(x=>x!==p):[...m.poste,p]}))} style={{display:"none"}}/>{p}</label>)}</div></div>
      <div style={{marginBottom:8}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:8}}><label className="label" style={{margin:0}}>Tableau des operations</label><button className="btn-ghost" style={{fontSize:11}} onClick={addLigne}>+ Ajouter ligne</button></div>
        <div style={{overflowX:"auto"}}>
          <table className="table" style={{minWidth:700}}>
            <thead><tr><th>Operation</th><th>Moyens mis en oeuvre</th><th>Risques</th><th>Moyens de prevention</th><th></th></tr></thead>
            <tbody>{newM.lignes.map((l,i)=><tr key={i}>
              {["operation","moyens","risques","prevention"].map(k=><td key={k}><textarea value={l[k]||""} onChange={e=>setLigne(i,k,e.target.value)} rows={2} style={{width:"100%",padding:"6px 8px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:12,resize:"vertical",fontFamily:"inherit"}}/></td>)}
              <td><button className="btn-danger" style={{fontSize:12,padding:"4px 8px"}} onClick={()=>delLigne(i)}>x</button></td>
            </tr>)}</tbody>
          </table>
        </div>
      </div>
      <div style={{display:"flex",gap:10,marginTop:12}}><button className="btn-secondary" onClick={()=>setShowNew(false)}>Annuler</button><button className="btn-primary" onClick={saveNew}>Creer</button></div>
    </div>}
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(320px,1fr))",gap:14}}>
      {modes.map(m=><div key={m.id} className="card" style={{cursor:"pointer"}} onClick={()=>setSelMode(m.id)}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start"}}>
          <div>
            <div style={{fontSize:11,color:"#d97706",fontWeight:700,marginBottom:4}}>{m.ref}</div>
            <div style={{fontWeight:700,fontSize:15,color:"#1a2216",marginBottom:8}}>{m.titre}</div>
            <div style={{display:"flex",gap:4,flexWrap:"wrap"}}>{m.poste.map(p=><Badge key={p} color="#1d4ed8" bg="#eff6ff">{p}</Badge>)}</div>
          </div>
          <div style={{display:"flex",gap:6,alignItems:"center",flexShrink:0}}>
            <Badge color="#6b7280" bg="#f3f4f6">{m.lignes.length} etapes</Badge>
            {isAdmin&&<button className="btn-danger" style={{fontSize:11,padding:"4px 8px"}} onClick={e=>{e.stopPropagation();del(m.id);}}>Suppr</button>}
          </div>
        </div>
      </div>)}
    </div>
  </div>;
}

function ModeDetail({mode,modes,setModes,isAdmin,onBack}){
  const [editing,setEditing]=useState(false);
  const [form,setForm]=useState({...mode,lignes:mode.lignes.map(l=>({...l}))});
  const setF=k=>e=>setForm(m=>({...m,[k]:e.target.value}));
  const setLigne=(i,k,v)=>setForm(m=>({...m,lignes:m.lignes.map((l,idx)=>idx===i?{...l,[k]:v}:l)}));
  const addLigne=()=>setForm(m=>({...m,lignes:[...m.lignes,{operation:"",moyens:"",risques:"",prevention:""}]}));
  const delLigne=i=>setForm(m=>({...m,lignes:m.lignes.filter((_,idx)=>idx!==i)}));
  const save=()=>{setModes(modes.map(m=>m.id===form.id?form:m));setEditing(false);};
  const cur=editing?form:mode;
  return <div>
    <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
      <button className="btn-secondary" style={{fontSize:12}} onClick={onBack}>Retour</button>
      <div style={{flex:1}}>
        <div style={{fontSize:11,color:"#d97706",fontWeight:700}}>{cur.ref}</div>
        <h2 style={{fontFamily:"'Fraunces',serif",fontSize:20,fontWeight:800,color:"#1a2216"}}>{cur.titre}</h2>
      </div>
      {isAdmin&&!editing&&<button className="btn-secondary" onClick={()=>{setForm({...mode,lignes:mode.lignes.map(l=>({...l}))});setEditing(true);}}>Modifier</button>}
      {editing&&<><button className="btn-secondary" onClick={()=>setEditing(false)}>Annuler</button><button className="btn-primary" onClick={save}>Enregistrer</button></>}
    </div>
    <div style={{marginBottom:14,display:"flex",gap:6,flexWrap:"wrap"}}>
      {cur.poste.map(p=><Badge key={p} color="#1d4ed8" bg="#eff6ff">{p}</Badge>)}
    </div>
    <div className="card" style={{padding:0,overflow:"hidden"}}>
      <div style={{overflowX:"auto"}}>
        <table className="table" style={{minWidth:800}}>
          <thead><tr>
            <th style={{width:"5%",background:"#14532d",color:"#fff"}}>#</th>
            <th style={{width:"22%",background:"#14532d",color:"#fff"}}>Operation</th>
            <th style={{width:"25%",background:"#166534",color:"#fff"}}>Moyens mis en oeuvre</th>
            <th style={{width:"24%",background:"#dc2626",color:"#fff"}}>Risques</th>
            <th style={{width:"24%",background:"#15803d",color:"#fff"}}>Moyens de prevention</th>
            {editing&&<th style={{background:"#1a2e1a",color:"#fff",width:"4%"}}></th>}
          </tr></thead>
          <tbody>
            {cur.lignes.map((l,i)=>editing?<tr key={i}>
              <td style={{textAlign:"center",fontWeight:700,color:"#6b7280"}}>{i+1}</td>
              {["operation","moyens","risques","prevention"].map(k=><td key={k}><textarea value={l[k]||""} onChange={e=>setLigne(i,k,e.target.value)} rows={2} style={{width:"100%",padding:"6px 8px",border:"1.5px solid #e5e7eb",borderRadius:8,fontSize:12,resize:"vertical",fontFamily:"inherit"}}/></td>)}
              <td><button className="btn-danger" style={{fontSize:12,padding:"4px 8px"}} onClick={()=>delLigne(i)}>x</button></td>
            </tr>:<tr key={i}>
              <td style={{textAlign:"center",fontWeight:800,color:"#14532d",fontSize:16}}>{i+1}</td>
              <td style={{fontWeight:600}}>{l.operation}</td>
              <td style={{color:"#374151"}}>{l.moyens}</td>
              <td>{(l.risques||"").split(",").map((r,j)=>r.trim()&&<div key={j} style={{display:"flex",gap:6}}><span style={{color:"#dc2626"}}>-</span><span style={{fontSize:12}}>{r.trim()}</span></div>)}</td>
              <td>{(l.prevention||"").split(",").map((r,j)=>r.trim()&&<div key={j} style={{display:"flex",gap:6}}><span style={{color:"#16a34a"}}>v</span><span style={{fontSize:12}}>{r.trim()}</span></div>)}</td>
            </tr>)}
          </tbody>
        </table>
      </div>
    </div>
    {editing&&<div style={{marginTop:10}}><button className="btn-ghost" style={{fontSize:12}} onClick={addLigne}>+ Ajouter une ligne</button></div>}
  </div>;
}

function DocumentsPage({docs,setDocs,isAdmin,docCats,setDocCats}){
  const [filter,setFilter]=useState("Tous");
  const [showNew,setShowNew]=useState(false);
  const [showCatEditor,setShowCatEditor]=useState(false);
  const [viewDoc,setViewDoc]=useState(null);
  const empty={titre:"",type:"",categorie:docCats[0]||"Securite",date:"",poste:"Tous",description:"",document:null,nomDoc:null};
  const [form,setForm]=useState(empty);
  const set=k=>e=>setForm(f=>({...f,[k]:e.target.value}));
  const filtered=filter==="Tous"?docs:docs.filter(d=>d.categorie===filter);
  const save=()=>{if(!form.titre.trim())return;setDocs([...docs,{...form,id:Date.now()}]);setShowNew(false);setForm(empty);};
  const del=id=>setDocs(docs.filter(d=>d.id!==id));
  return <div>
    {viewDoc&&<DocViewer doc={viewDoc.doc} nom={viewDoc.nom} onClose={()=>setViewDoc(null)}/>}
    <SectionHdr icon="&#128193;" title="Documents HSE" action={isAdmin&&<div style={{display:"flex",gap:8}}>
      <button className="btn-secondary" style={{fontSize:12}} onClick={()=>setShowCatEditor(true)}>Categories</button>
      <button className="btn-primary" onClick={()=>setShowNew(true)}>+ Ajouter document</button>
    </div>}/>
    {showCatEditor&&<CatEditor cats={docCats} onSave={setDocCats} onClose={()=>setShowCatEditor(false)}/>}
    {showNew&&<div className="card" style={{marginBottom:16,border:"1.5px solid #e9d5ff"}}>
      <div style={{fontWeight:700,marginBottom:14}}>Nouveau document HSE</div>
      <div className="split"><Fld label="Titre *" value={form.titre} onChange={set("titre")} placeholder="Nom du document"/><FldSel label="Categorie" value={form.categorie} onChange={set("categorie")} options={docCats}/></div>
      <div className="split3"><Fld label="Type" value={form.type} onChange={set("type")} placeholder="Ex: Procedure, FDS"/><Fld label="Date" value={form.date} onChange={set("date")} type="date"/><FldSel label="Destine a" value={form.poste} onChange={set("poste")} options={["Tous",...POSTES_LIST]}/></div>
      <FldArea label="Description" value={form.description} onChange={set("description")} rows={2}/>
      <div style={{marginBottom:12}}>
        <label className="label">Fichier</label>
        <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
          <FileBtn onFile={(b,n)=>setForm(f=>({...f,document:b,nomDoc:n}))}>Joindre fichier</FileBtn>
          {form.document&&<div style={{display:"flex",gap:6,alignItems:"center"}}><span style={{fontSize:12,color:"#7c3aed",fontWeight:600}}>{form.nomDoc}</span><button className="btn-danger" style={{fontSize:11,padding:"3px 8px"}} onClick={()=>setForm(f=>({...f,document:null,nomDoc:null}))}>x</button></div>}
        </div>
      </div>
      <div style={{display:"flex",gap:10}}><button className="btn-secondary" onClick={()=>setShowNew(false)}>Annuler</button><button className="btn-primary" onClick={save}>Ajouter</button></div>
    </div>}
    <div style={{display:"flex",gap:8,marginBottom:16,flexWrap:"wrap"}}>
      {["Tous",...docCats].map(c=><button key={c} className={"tag-filter"+(filter===c?" active":"")} onClick={()=>setFilter(c)}>{c}</button>)}
    </div>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
      {filtered.map(d=><div key={d.id} className="card" style={{padding:16}}>
        <div style={{fontWeight:700,fontSize:14,color:"#1a2216"}}>{d.titre}</div>
        <div style={{fontSize:11,color:"#6b7280",marginTop:2}}>{d.type&&d.type+" - "}{d.date&&fmtDate(d.date)+" - "}{d.poste}</div>
        {d.description&&<div style={{fontSize:11,color:"#9ca3af",marginTop:3}}>{d.description}</div>}
        <div style={{display:"flex",gap:6,marginTop:10,flexWrap:"wrap"}}>
          <Badge color="#16a34a" bg="#dcfce7">{d.categorie}</Badge>
          {d.document&&<><button className="btn-ghost" style={{fontSize:11}} onClick={()=>setViewDoc({doc:d.document,nom:d.nomDoc})}>Voir</button><button className="btn-ghost" style={{fontSize:11}} onClick={()=>downloadFile(d.document,d.nomDoc)}>Telecharger</button></>}
          {isAdmin&&<button className="btn-danger" style={{fontSize:11}} onClick={()=>del(d.id)}>Suppr</button>}
        </div>
      </div>)}
    </div>
  </div>;
}

function CatEditor({cats,onSave,onClose}){
  const [list,setList]=useState([...cats]);
  const [newCat,setNewCat]=useState("");
  const add=()=>{if(newCat.trim()&&!list.includes(newCat.trim())){setList([...list,newCat.trim()]);setNewCat("");}};
  const del=i=>setList(list.filter((_,idx)=>idx!==i));
  return <Modal title="Gerer les categories" onClose={onClose}>
    <div style={{marginBottom:16}}>
      <div style={{display:"flex",gap:8,marginBottom:12}}>
        <input className="input" value={newCat} onChange={e=>setNewCat(e.target.value)} onKeyDown={e=>e.key==="Enter"&&add()} placeholder="Nouvelle categorie..." style={{flex:1}}/>
        <button className="btn-primary" onClick={add}>Ajouter</button>
      </div>
      <div style={{display:"flex",flexWrap:"wrap",gap:8}}>
        {list.map((c,i)=><div key={i} style={{display:"flex",alignItems:"center",gap:6,background:"#f0f2ee",borderRadius:8,padding:"5px 12px"}}>
          <span style={{fontSize:13,fontWeight:600}}>{c}</span>
          <button onClick={()=>del(i)} style={{background:"none",border:"none",cursor:"pointer",color:"#dc2626",fontSize:16,lineHeight:1}}>x</button>
        </div>)}
      </div>
    </div>
    <div style={{display:"flex",gap:10}}>
      <button className="btn-secondary" onClick={onClose}>Annuler</button>
      <button className="btn-primary" onClick={()=>{onSave(list);onClose();}}>Enregistrer</button>
    </div>
  </Modal>;
}

function EmpsPage({employees,setEmployees,formations,formDates,medVisits,epiData,hablData,isAdmin,onSelectEmp}){
  const [showNew,setShowNew]=useState(false);
  const [search,setSearch]=useState("");
  const filtered=employees.filter(e=>e.nom.toLowerCase().includes(search.toLowerCase())||e.poste.toLowerCase().includes(search.toLowerCase()));
  const addEmp=emp=>{setEmployees([...employees,{...emp,id:Date.now(),infoPerso:{}}]);setShowNew(false);};
  const ac=emp=>{let d=0,w=0;formations.filter(f=>f.employes.includes(emp.id)).forEach(f=>{const s=fStatus(f.id,emp.id,f.dureeValidite,formDates);if(s.s==="exp"||s.s==="non")d++;else if(s.s==="soon")w++;});(medVisits[emp.id]||[]).forEach(v=>{if(dStatus(v.prochaine).label==="Depassee")d++;});(epiData[emp.id]||[]).forEach(e=>{if(epiStatus(e.dateExpiration).label==="Expire")d++;});return{d,w};};
  return <div>
    {showNew&&<EmpEditModal emp={{}} onSave={addEmp} onClose={()=>setShowNew(false)}/>}
    <SectionHdr icon="&#128119;" title="Salaries" action={isAdmin&&<button className="btn-primary" onClick={()=>setShowNew(true)}>+ Nouveau salarie</button>}/>
    <input className="input" value={search} onChange={e=>setSearch(e.target.value)} placeholder="Rechercher un salarie..." style={{maxWidth:360,marginBottom:16}}/>
    <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:14}}>
      {filtered.map(emp=>{const{d,w}=ac(emp);return <div key={emp.id} className="card" style={{cursor:"pointer",padding:16}} onClick={()=>onSelectEmp(emp.id)}>
        <div style={{display:"flex",alignItems:"center",gap:12}}>
          <Avatar emp={emp} size={50}/>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontWeight:700,fontSize:15,color:"#1a2216"}}>{emp.nom}</div>
            <div style={{fontSize:12,color:"#6b7280",marginTop:2}}>{emp.poste}</div>
            <div style={{fontSize:11,color:"#9ca3af"}}>{emp.matricule}</div>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:4,alignItems:"flex-end"}}>
            {d>0&&<Badge color="#dc2626" bg="#fee2e2">urgent {d}</Badge>}
            {w>0&&<Badge color="#d97706" bg="#fef3c7">attention {w}</Badge>}
            {d===0&&w===0&&<Badge color="#16a34a" bg="#dcfce7">OK</Badge>}
          </div>
        </div>
      </div>;})}
    </div>
  </div>;
}

export default function App(){
  // TOUS les useState en haut, AVANT tout return conditionnel
  const [loaded,setLoaded]=useState(false);
  const [role,setRole]=useState(null);
  const [page,setPage]=useState("dashboard");
  const [selEmp,setSelEmp]=useState(null);
  const [sidebarOpen,setSidebarOpen]=useState(false);
  const [employees,setEmployeesR]=useState(INIT_EMPS);
  const [formations,setFormationsR]=useState(INIT_FORMATIONS);
  const [formDates,setFormDatesR]=useState(INIT_FORM_DATES);
  const [medVisits,setMedVisitsR]=useState({});
  const [empDocs,setEmpDocsR]=useState({});
  const [epiData,setEpiDataR]=useState({});
  const [hablData,setHablDataR]=useState({});
  const [hseDocs,setHseDocsR]=useState(INIT_HSE_DOCS);
  const [modes,setModesR]=useState(INIT_MODES);
  const [docCats,setDocCatsR]=useState(INIT_DOC_CATS);

  const closeSidebar=()=>setSidebarOpen(false);

  const setEmployees=async v=>{setEmployeesR(v);await sSave("ev2-emps",v);};
  const setFormations=async v=>{setFormationsR(v);await sSave("ev2-forms",v);};
  const setFormDates=async v=>{setFormDatesR(v);await sSave("ev2-fdates",v);};
  const setHseDocs=async v=>{setHseDocsR(v);await sSave("ev2-hsedocs",v);};
  const setModes=async v=>{setModesR(v);await sSave("ev2-modes",v);};
  const setDocCats=async v=>{setDocCatsR(v);await sSave("ev2-doccats",v);};
  const saveMed=async(eid,v)=>{const u={...medVisits,[eid]:v};setMedVisitsR(u);await sSave("ev2-med",u);};
  const saveEmpDocs=async(eid,v)=>{const u={...empDocs,[eid]:v};setEmpDocsR(u);await sSave("ev2-empdocs",u);};
  const saveEpi=async(eid,v)=>{const u={...epiData,[eid]:v};setEpiDataR(u);await sSave("ev2-epi",u);};
  const saveHabl=async(eid,v)=>{const u={...hablData,[eid]:v};setHablDataR(u);await sSave("ev2-habl",u);};
  const saveEmp=emp=>setEmployees(employees.map(e=>e.id===emp.id?emp:e));
  const delEmp=empId=>{setEmployees(employees.filter(e=>e.id!==empId));setSelEmp(null);setPage("employes");};

  useEffect(()=>{
    (async()=>{
      try{
        const[e,f,fd,mv,ed,epi,habl,hd,m,dc]=await Promise.all([
          sGet("ev2-emps",INIT_EMPS),sGet("ev2-forms",INIT_FORMATIONS),sGet("ev2-fdates",INIT_FORM_DATES),
          sGet("ev2-med",{}),sGet("ev2-empdocs",{}),sGet("ev2-epi",{}),sGet("ev2-habl",{}),
          sGet("ev2-hsedocs",INIT_HSE_DOCS),sGet("ev2-modes",INIT_MODES),sGet("ev2-doccats",INIT_DOC_CATS),
        ]);
        setEmployeesR(e);setFormationsR(f);setFormDatesR(fd);setMedVisitsR(mv);
        setEmpDocsR(ed);setEpiDataR(epi);setHablDataR(habl);setHseDocsR(hd);setModesR(m);setDocCatsR(dc);
      }catch(err){console.error("Erreur chargement:",err);}
      setLoaded(true);
    })();
  },[]);

  const isAdmin=role==="admin";
  const NAV=[
    {k:"dashboard",i:"&#127968;",l:"Tableau de bord"},
    {k:"employes",i:"&#128119;",l:"Salaries"},
    {k:"formations",i:"&#127891;",l:"Formations"},
    {k:"modes",i:"&#128295;",l:"Modes operatoires"},
    {k:"documents",i:"&#128193;",l:"Documents HSE"},
  ];

  if(!loaded)return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"#052e16"}}><style>{G}</style><div style={{textAlign:"center",color:"#fff"}}><div style={{fontSize:48}}>&#127807;</div><div style={{marginTop:10,fontSize:14,opacity:.7}}>Chargement...</div></div></div>;

  if(!role)return <><style>{G}</style><Login onAdmin={()=>{setRole("admin");setPage("dashboard");}} onSalarie={()=>{setRole("salarie");setPage("employes");}}/></>;

  const selEmpObj=employees.find(e=>e.id===selEmp);

  return <div style={{display:"flex",minHeight:"100vh",background:"#f0f2ee"}}>
    <style>{G}</style>
    <button className="menu-toggle" onClick={()=>setSidebarOpen(o=>!o)} style={{display:"none"}}>
      {sidebarOpen?"X":"="}
    </button>
    <div className={"sidebar-overlay"+(sidebarOpen?" open":"")} onClick={closeSidebar}/>
    <div className={"sidebar"+(sidebarOpen?" open":"")} style={{width:220,background:"#fff",borderRight:"1.5px solid #e5e7eb",display:"flex",flexDirection:"column",position:"fixed",top:0,left:0,height:"100vh",zIndex:20}}>
      <div style={{padding:"20px 16px 16px"}}>
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:4}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <span style={{fontSize:26}}>&#127807;</span>
            <div>
              <div style={{fontSize:12,fontWeight:800,color:"#14532d",letterSpacing:.5}}>MASE</div>
              <div style={{fontSize:10,color:"#9ca3af",fontWeight:600}}>Espaces Verts</div>
            </div>
          </div>
          <button onClick={closeSidebar} style={{background:"#f0f2ee",border:"none",borderRadius:8,width:28,height:28,cursor:"pointer",fontSize:16,display:"flex",alignItems:"center",justifyContent:"center",flexShrink:0}}>x</button>
        </div>
        <div style={{marginTop:8,fontSize:11,fontWeight:700,color:isAdmin?"#14532d":"#6b7280",background:isAdmin?"#dcfce7":"#f0f2ee",borderRadius:8,padding:"4px 10px",display:"inline-block"}}>{isAdmin?"Admin":"Salarie"}</div>
      </div>
      <nav style={{flex:1,padding:"8px 10px",overflowY:"auto"}}>
        {NAV.map(n=><button key={n.k} className={"sidebar-link"+(page===n.k&&!selEmp?" active":"")} onClick={()=>{setPage(n.k);setSelEmp(null);closeSidebar();}}>
          <span dangerouslySetInnerHTML={{__html:n.i}}/>{n.l}
        </button>)}
      </nav>
      <div style={{padding:"12px 16px",borderTop:"1px solid #e5e7eb"}}>
        <div style={{fontSize:11,color:"#9ca3af",marginBottom:8}}>Connecte en tant que</div>
        <div style={{fontSize:12,fontWeight:700,color:"#374151",marginBottom:8}}>{isAdmin?"Administrateur":"Espace Salarie"}</div>
        <button className="btn-secondary" style={{width:"100%",fontSize:12,justifyContent:"center"}} onClick={()=>{setRole(null);setPage("dashboard");setSelEmp(null);closeSidebar();}}>Deconnexion</button>
      </div>
    </div>
    <div className="main-content" style={{marginLeft:220,flex:1,padding:"28px 32px",maxWidth:1200,boxSizing:"border-box"}}>
      {selEmp&&selEmpObj?<EmpDetail
        emp={selEmpObj} formations={formations} formDates={formDates}
        medVisits={medVisits} empDocs={empDocs} epiData={epiData} hablData={hablData}
        onSaveFormDates={setFormDates} onSaveMed={saveMed} onSaveDocs={saveEmpDocs}
        onSaveEpi={saveEpi} onSaveHabl={saveHabl} onSaveEmp={saveEmp} onDeleteEmp={delEmp}
        isAdmin={isAdmin} onBack={()=>setSelEmp(null)} docCats={docCats}
      />:
      page==="dashboard"?<Dashboard employees={employees} formations={formations} formDates={formDates} medVisits={medVisits} epiData={epiData} hablData={hablData} setPage={setPage} setSelEmp={empId=>{setSelEmp(empId);setPage("employe");}} isAdmin={isAdmin}/>:
      page==="employes"?<EmpsPage employees={employees} setEmployees={setEmployees} formations={formations} formDates={formDates} medVisits={medVisits} epiData={epiData} hablData={hablData} isAdmin={isAdmin} onSelectEmp={id=>setSelEmp(id)}/>:
      page==="formations"?<FormationsPage formations={formations} setFormations={setFormations} employees={employees} formDates={formDates} setFormDates={setFormDates} isAdmin={isAdmin}/>:
      page==="modes"?<ModesPage modes={modes} setModes={setModes} isAdmin={isAdmin}/>:
      page==="documents"?<DocumentsPage docs={hseDocs} setDocs={setHseDocs} isAdmin={isAdmin} docCats={docCats} setDocCats={setDocCats}/>:null}
    </div>
  </div>;
}

'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';

export default function Timetable() {
  return (
    <>
      <Head>
        <title>Timetable — GCHSS Sukkur</title>
        <meta name="description" content="Master Timetable System for Govt. Comprehensive HSS Sukkur" />
      </Head>
      <TimetableApp />
    </>
  );
}

// ─── Inline Timetable App (no external dependencies needed) ──────────────────
// All React code is self-contained so it works in any Next.js project.

import { useState, useEffect, useMemo, useCallback } from 'react';

const INITIAL_CLASSES = ['VI-A','VI-B','VI-C','VII-A','VII-B','VII-C','VIII-A','VIII-B','VIII-C','IX-A','IX-B','IX-C','X-A','X-B','X-C'];

const INITIAL_ASSIGNMENTS = {
  'VI-A':   {English:'Abdul Fattah Channa',Maths:'Kanwar Lal','G.Science':'Allah Wasayo',Urdu:'Zia Saud',Sindhi:'Muhammad Ali Bullo',Islamiat:'Muhammad Ali Napir','Social Study':'A. Ghafoor Qureshi'},
  'VI-B':   {English:'Ghous Bux',Maths:'Kanwar Lal','G.Science':'Allah Wasayo',Urdu:'Zia Saud',Sindhi:'Muhammad Ali Bullo',Islamiat:'Ahsan Ali','Social Study':'A. Ghafoor Qureshi'},
  'VI-C':   {English:'Zahoor Ahmed',Maths:'Zahoor Ahmed','G.Science':'Allah Wasayo',Urdu:'Muhammad Nawaz',Sindhi:'Muhammad Ali Bullo',Islamiat:'Ahsan Ali','Social Study':'A. Ghafoor Qureshi'},
  'VII-A':  {English:'Kanwar Lal',Maths:'Awais Khawar','G.Science':'Ali Gohar',Urdu:'Muhammad Nawaz',Sindhi:'Abdul Fattah Channa',Islamiat:'Muhammad Ali Napir','Social Study':'Waseem Ahmed'},
  'VII-B':  {English:'Zia Saud',Maths:'Sarfaraz Ali','G.Science':'Ali Gohar',Urdu:'Muhammad Nawaz',Sindhi:'Abdul Fattah Channa',Islamiat:'Muhammad Ali Napir','Social Study':'Waseem Ahmed'},
  'VII-C':  {English:'Faiz Adil',Maths:'Awais Khawar','G.Science':'Mazhar Ali',Urdu:'Ayazuddin',Islamiat:'Ahsan Ali Channa','Social Study':'Waseem Ahmed'},
  'VIII-A': {English:'Mazhar Ali',Maths:'Nazeer Ahmed','G.Science':'Ghulam Mustafa',Urdu:'Muhammad Sajid',Sindhi:'Abdul Fattah Memon',Islamiat:'Abdul Rehman Memon','Social Study':'Tanweer Hassan'},
  'VIII-B': {English:'Ahsan Nabi',Maths:'Nazeer Ahmed','G.Science':'Ghulam Mustafa',Urdu:'Muhammad Sajid',Sindhi:'Abdul Fattah Memon',Islamiat:'Abdul Rehman Memon','Social Study':'Tanweer Hassan'},
  'VIII-C': {English:'Aurangzaib',Maths:'Nazeer Ahmed','G.Science':'Ghulam Mustafa',Urdu:'Muhammad Sajid',Sindhi:'Abdul Fattah Memon',Islamiat:'Abdul Rehman Memon','Social Study':'Tanweer Hassan'},
  'IX-A':   {English:'Fayaz Ali','E.Math':'Zahoor Ahmed',Physics:'Sarfaraz',Chemistry:'Bharat Lal',Biology:'Amir Mustafa',Islamiat:'A. Ghafoor Channa',Sindhi:'Munwar Ali'},
  'IX-B':   {English:'Asif Ali','E.Math':'Farhan Nabi',Physics:'Fayaz Ali',Chemistry:'Bharat Lal',Biology:'Ghulam Mehdi',Islamiat:'A. Ghafoor Channa',Sindhi:'Munwar Ali'},
  'IX-C':   {English:'Amir Mustafa','E.Math':'Aurangzaib',Physics:'Sarfaraz',Chemistry:'Ahsan Nabi',Biology:'Ghulam Mehdi',Islamiat:'Abdul Samad',Sindhi:'Mazhar Ali'},
  'X-A':    {English:'Bilal Hassan','E.Math':'G. Mujtaba Azhar',Physics:'Farhan Nabi',Chemistry:'Ramesh Kumar',Biology:'Shoaib','P.S':'Rahim Bux',Urdu:'Munwar Ali'},
  'X-B':    {English:'Ayazuddin','E.Math':'G. Mujtaba Azhar',Physics:'Farhan Nabi',Chemistry:'Ramesh Kumar',Biology:'Sandeep Kumar','P.S':'Rahim Bux',Urdu:'Awais Khawar'},
  'X-C':    {English:'Ghulam Mehdi','E.Math':'G. Mujtaba Azhar',Physics:'Bilal Hassan',Chemistry:'Sajjad Ali Mirani',Biology:'Manohar Lal','P.S':'Aurangzaib',Urdu:'Faiz Adil'},
};

const INITIAL_EXTRA_TEACHERS = ['Imtiaz Ahmed','Rashid Hussain','Noman Siddiqui','Saima Batool','Rubina Khatoon'];
const DAYS = ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const DEFAULT_TIMINGS = {
  regular:[
    {start:'08:00',end:'08:45'},{start:'08:45',end:'09:30'},{start:'09:30',end:'10:15'},
    {start:'10:45',end:'11:30'},{start:'11:30',end:'12:15'},{start:'12:15',end:'01:00'},{start:'01:00',end:'01:45'}
  ],
  friday:[
    {start:'08:00',end:'08:50'},{start:'08:50',end:'09:40'},{start:'09:40',end:'10:30'},
    {start:'11:00',end:'11:50'},{start:'11:50',end:'12:40'}
  ]
};
const SC = {
  English:'#10a37f',Maths:'#1a73e8','E.Math':'#1a73e8','G.Science':'#0f9d58',
  Physics:'#f9ab00',Chemistry:'#ea4335',Biology:'#8b5cf6',Urdu:'#e91e8c',
  Sindhi:'#ff6d00',Islamiat:'#00897b','Social Study':'#1565c0','P.S':'#6d28d9'
};
const gc = s => SC[s]||'#6b7280';

function TimetableApp() {
  const [tab, setTab] = useState('timetable');
  const [assignments, setAssignments] = useState(INITIAL_ASSIGNMENTS);
  const [classes, setClasses] = useState(INITIAL_CLASSES);
  const [extraTeachers, setExtraTeachers] = useState(INITIAL_EXTRA_TEACHERS);
  const [newTeacherName, setNewTeacherName] = useState('');
  const [baseTT, setBaseTT] = useState({});
  const [absences, setAbsences] = useState({});
  const [selClass, setSelClass] = useState(INITIAL_CLASSES[0]);
  const [masterDay, setMasterDay] = useState('Monday');
  const [timings, setTimings] = useState(DEFAULT_TIMINGS);
  const [absDay, setAbsDay] = useState('Monday');
  const [search, setSearch] = useState('');
  const [subView, setSubView] = useState('grid');

  const teachers = useMemo(() => {
    const fromAssign = new Set(Object.values(assignments).flatMap(o=>Object.values(o)));
    const allNames = [...new Set([...fromAssign, ...extraTeachers])].filter(n=>n&&n!=='N/A').sort();
    return allNames.map((name,i)=>({id:'t'+i,name,isExtra:!fromAssign.has(name)}));
  },[assignments,extraTeachers]);

  const genTT = useCallback(()=>{
    const tt={};
    DAYS.forEach(day=>{
      tt[day]={};
      const maxP = day==='Friday'?5:7;
      const teacherCount = {};
      teachers.forEach(t=>{ teacherCount[t.id]=0; });
      for(let p=1;p<=maxP;p++){
        tt[day][p]={};
        const busy=new Set();
        if(p===1){
          classes.forEach(cls=>{
            const t=teachers.find(x=>x.name===assignments[cls]?.English);
            if(t&&!busy.has(t.id)&&teacherCount[t.id]<4){
              tt[day][p][cls]={teacherId:t.id,subject:'English',isSub:false};
              busy.add(t.id);teacherCount[t.id]++;
            }
          });
        }
        classes.forEach(cls=>{
          if(tt[day][p][cls])return;
          const ca=assignments[cls]||{};
          const all=Object.keys(ca);
          const pool=all.filter(s=>s!=='English');
          const subjects=pool.length?pool:all;
          const sub=subjects[(p+DAYS.indexOf(day)+classes.indexOf(cls))%subjects.length];
          const t=teachers.find(x=>x.name===ca[sub]);
          if(t&&!busy.has(t.id)&&teacherCount[t.id]<4){
            tt[day][p][cls]={teacherId:t.id,subject:sub,isSub:false};
            busy.add(t.id);teacherCount[t.id]++;
          } else {
            const fb=all.find(s=>{const tx=teachers.find(x=>x.name===ca[s]);return tx&&!busy.has(tx.id)&&teacherCount[tx.id]<4;});
            if(fb){
              const tx=teachers.find(x=>x.name===ca[fb]);
              tt[day][p][cls]={teacherId:tx.id,subject:fb,isSub:false};
              busy.add(tx.id);teacherCount[tx.id]++;
            } else { tt[day][p][cls]=null; }
          }
        });
      }
      teachers.filter(t=>!t.isExtra).forEach(t=>{
        if(teacherCount[t.id]<3){
          outer:for(let p=1;p<=maxP;p++){
            for(const cls of classes){
              if(!tt[day][p][cls]){
                tt[day][p][cls]={teacherId:t.id,subject:'Free Period',isSub:false};
                teacherCount[t.id]++;
                if(teacherCount[t.id]>=3) break outer;
              }
            }
          }
        }
      });
    });
    setBaseTT(tt);setAbsences({});
  },[assignments,teachers,classes]);

  useEffect(()=>{genTT();},[genTT]);

  const dispTT = useMemo(()=>{
    if(!Object.keys(baseTT).length)return{};
    const f=JSON.parse(JSON.stringify(baseTT));
    DAYS.forEach(day=>{
      const abs=absences[day]||[];
      const maxP=day==='Friday'?5:7;
      const basePeriodCount={};
      teachers.forEach(t=>{ basePeriodCount[t.id]=0; });
      for(let p=1;p<=maxP;p++){
        classes.forEach(c=>{
          const s=f[day]?.[p]?.[c];
          if(s&&!abs.includes(s.teacherId)) basePeriodCount[s.teacherId]=(basePeriodCount[s.teacherId]||0)+1;
        });
      }
      const subCount={};
      teachers.forEach(t=>{ subCount[t.id]=0; });
      for(let p=1;p<=maxP;p++){
        const busy=new Set();
        classes.forEach(c=>{const s=f[day]?.[p]?.[c];if(s&&!abs.includes(s.teacherId))busy.add(s.teacherId);});
        classes.forEach(c=>{
          const s=f[day]?.[p]?.[c];
          if(s&&abs.includes(s.teacherId)){
            const candidates=teachers.filter(t=>{
              if(abs.includes(t.id)||busy.has(t.id)) return false;
              const allowedSubs=Math.max(0,3-(basePeriodCount[t.id]||0));
              return (subCount[t.id]||0)<allowedSubs;
            });
            candidates.sort((a,b)=>{
              if(a.isExtra!==b.isExtra) return a.isExtra?-1:1;
              return ((basePeriodCount[a.id]||0)+(subCount[a.id]||0))-((basePeriodCount[b.id]||0)+(subCount[b.id]||0));
            });
            if(candidates.length){
              const sub=candidates[0];
              f[day][p][c]={...s,teacherId:sub.id,isSub:true,originalTeacherId:s.teacherId};
              busy.add(sub.id);subCount[sub.id]=(subCount[sub.id]||0)+1;
            } else {
              f[day][p][c]={...s,teacherId:'none',isSub:true,originalTeacherId:s.teacherId};
            }
          }
        });
      }
    });
    return f;
  },[baseTT,absences,teachers,classes]);

  const getSubList=(day)=>{
    const maxP=day==='Friday'?5:7;const subs=[];
    for(let p=1;p<=maxP;p++){classes.forEach(c=>{const sl=dispTT[day]?.[p]?.[c];if(sl?.isSub)subs.push({period:p,cls:c,subject:sl.subject,subTeacher:gT(sl.teacherId)?.name||'Unassigned',origTeacher:gT(sl.originalTeacherId)?.name||'—'});});}
    return subs;
  };
  const toggleAbs=(day,tid)=>setAbsences(prev=>{const arr=prev[day]||[];return arr.includes(tid)?{...prev,[day]:arr.filter(x=>x!==tid)}:{...prev,[day]:[...arr,tid]};});
  const gT=id=>teachers.find(t=>t.id===id);
  const filtTeachers=useMemo(()=>{const q=search.trim().toLowerCase();return q?teachers.filter(t=>t.name.toLowerCase().includes(q)):teachers;},[teachers,search]);
  const absTot=Object.values(absences).reduce((s,a)=>s+a.length,0);
  const addExtraTeacher=()=>{const name=newTeacherName.trim();if(!name||extraTeachers.includes(name))return;setExtraTeachers(prev=>[...prev,name]);setNewTeacherName('');};
  const removeExtraTeacher=(name)=>setExtraTeachers(prev=>prev.filter(n=>n!==name));

  const handleFileUpload=e=>{
    const file=e.target.files[0];if(!file)return;
    const reader=new FileReader();
    reader.onload=ev=>{
      const rows=ev.target.result.split('\n').filter(r=>r.trim());
      const na={};const nc=new Set();
      rows.slice(1).forEach(row=>{const [cls,subj,tch]=row.split(',').map(s=>s?.trim());if(cls&&subj&&tch){if(!na[cls])na[cls]={};na[cls][subj]=tch;nc.add(cls);}});
      if(Object.keys(na).length){setAssignments(na);const cl=[...nc].sort();setClasses(cl);setSelClass(cl[0]);}
    };
    reader.readAsText(file);
  };

  const handlePrint=()=>{
    const day=masterDay;const maxP=day==='Friday'?5:7;
    const dayT=day==='Friday'?timings.friday:timings.regular;
    const absList=(absences[day]||[]).map(id=>gT(id)?.name).filter(Boolean);
    const subList=getSubList(day);
    const hcells=Array.from({length:maxP},(_,i)=>{const t=dayT[i]||{};const brk=i===3?`<th style="background:#e6f7f4;color:#10a37f;border:1px solid #ddd;padding:3px;font-size:9px;min-width:18px">☕</th>`:'';return`${brk}<th style="background:#1a1a2e;color:#fff;padding:7px 5px;border:1px solid #2d2d4e;font-size:11px;min-width:105px">P${i+1}<br><span style="font-weight:400;font-size:9px">${t.start||''}–${t.end||''}</span></th>`;}).join('');
    const rows=classes.map(c=>{const cells=Array.from({length:maxP},(_,i)=>{const p=i+1;const sl=dispTT[day]?.[p]?.[c];const brk=i===3?`<td style="background:#e6f7f4;border:1px solid #ddd;width:18px"></td>`:'';if(!sl)return`${brk}<td style="border:1px solid #ddd;color:#ccc;text-align:center;font-size:10px;padding:4px">—</td>`;const col=gc(sl.subject);return`${brk}<td style="border:1px solid #ddd;padding:5px 6px;vertical-align:top"><div style="border-left:3px solid ${col};padding-left:4px"><div style="font-weight:700;color:${col};font-size:11px">${sl.subject}</div><div style="color:#444;font-size:10px">${gT(sl.teacherId)?.name||'—'}</div>${sl.isSub?`<span style="font-size:9px;background:#e6f7f4;color:#10a37f;padding:1px 4px;border-radius:3px;font-weight:700">SUB ← ${gT(sl.originalTeacherId)?.name||'?'}</span>`:''}</div></td>`;}).join('');return`<tr><td style="padding:6px 9px;font-weight:700;font-size:12px;border:1px solid #ddd;background:#fafafa;white-space:nowrap">${c}</td>${cells}</tr>`;}).join('');
    const subRows=subList.map(s=>`<tr><td style="padding:6px 10px;border:1px solid #ddd;font-weight:700;color:#10a37f">${s.period}</td><td style="padding:6px 10px;border:1px solid #ddd;font-weight:700">${s.cls}</td><td style="padding:6px 10px;border:1px solid #ddd">${s.subject}</td><td style="padding:6px 10px;border:1px solid #ddd;color:#ea4335;text-decoration:line-through">${s.origTeacher}</td><td style="padding:6px 10px;border:1px solid #ddd;color:#10a37f;font-weight:700">${s.subTeacher}</td></tr>`).join('');
    const html=`<!DOCTYPE html><html><head><meta charset="utf-8"><title>Timetable – ${day}</title><link href="https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;600;700&display=swap" rel="stylesheet"/><style>*{box-sizing:border-box;margin:0;padding:0}body{font-family:'DM Sans',Arial,sans-serif;padding:14px;background:#fff}table{border-collapse:collapse;width:100%}@page{size:A4 landscape;margin:8mm}</style></head><body><div style="text-align:center;margin-bottom:12px;padding-bottom:10px;border-bottom:3px solid #10a37f"><div style="font-size:22px;font-weight:700;color:#1a1a2e">Govt. Comprehensive Higher Secondary School</div><div style="font-size:12px;color:#6b7280;margin-top:3px">Master Timetable — <b>${day}</b> | Session 2025-26</div>${absList.length?`<div style="font-size:11px;color:#ea4335;margin-top:4px;font-weight:600">⚠ Absent: ${absList.join(', ')}</div>`:''}</div><table><thead><tr><th style="background:#1a1a2e;color:#fff;padding:8px 10px;border:1px solid #2d2d4e;text-align:left;font-size:12px">Class</th>${hcells}</tr></thead><tbody>${rows}</tbody></table>${subList.length?`<div style="margin-top:16px"><div style="font-size:13px;font-weight:700;color:#1a1a2e;margin-bottom:8px;padding-bottom:4px;border-bottom:2px solid #10a37f">📋 Substitute Teachers List — ${day}</div><table><thead><tr style="background:#f0fdf9"><th style="padding:7px 10px;border:1px solid #ddd;color:#6b7280;font-size:11px;text-align:left">Period</th><th style="padding:7px 10px;border:1px solid #ddd;color:#6b7280;font-size:11px;text-align:left">Class</th><th style="padding:7px 10px;border:1px solid #ddd;color:#6b7280;font-size:11px;text-align:left">Subject</th><th style="padding:7px 10px;border:1px solid #ddd;color:#6b7280;font-size:11px;text-align:left">Absent Teacher</th><th style="padding:7px 10px;border:1px solid #ddd;color:#6b7280;font-size:11px;text-align:left">Substitute</th></tr></thead><tbody>${subRows}</tbody></table></div>`:''}<div style="margin-top:10px;font-size:10px;color:#9ca3af;text-align:right">Printed: ${new Date().toLocaleString()}</div></body></html>`;
    const w=window.open('','_blank','width=1200,height=750');
    if(w){w.document.write(html);w.document.close();w.focus();setTimeout(()=>w.print(),500);}
    else{const blob=new Blob([html],{type:'text/html'});const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download=`Timetable-${day}.html`;a.click();}
  };

  const tb=(id)=>({display:'flex',alignItems:'center',gap:6,padding:'9px 14px',fontSize:13,fontWeight:500,border:'none',background:tab===id?'#e6f7f4':'transparent',cursor:'pointer',whiteSpace:'nowrap',borderRadius:8,color:tab===id?'#10a37f':'#6b7280'});
  const dayBtn=(d,a)=>({padding:'6px 14px',borderRadius:20,fontSize:12,fontWeight:600,border:`1.5px solid ${a?'#10a37f':'#e5e7eb'}`,background:a?'#10a37f':'#fff',color:a?'#fff':'#6b7280',cursor:'pointer'});
  const clsBtn=(c,a)=>({padding:'5px 13px',borderRadius:20,fontSize:12,fontWeight:600,border:`1.5px solid ${a?'#10a37f':'#e5e7eb'}`,background:a?'#10a37f':'#fff',color:a?'#fff':'#6b7280',cursor:'pointer'});

  const TABS=[
    {id:'timetable',label:'📅 Class Wise'},
    {id:'master',label:'🔲 Master View'},
    {id:'substitute',label:`🔄 Substitutes${absTot>0?` (${absTot})`:''}` },
    {id:'absence',label:'❌ Absences'},
    {id:'teachers',label:'👥 Teachers'},
    {id:'timings',label:'⚙️ Settings'},
    {id:'workload',label:'📊 Workload'},
  ];

  const card={background:'#fff',borderRadius:12,boxShadow:'0 1px 3px rgba(0,0,0,.08)',border:'1px solid #e5e7eb'};

  return (
    <div style={{fontFamily:'system-ui,sans-serif',background:'#f7f8fa',minHeight:'100vh'}}>
      {/* Header */}
      <div style={{background:'#fff',borderBottom:'1px solid #e5e7eb',padding:'0 20px',position:'sticky',top:0,zIndex:100}}>
        <div style={{maxWidth:1400,margin:'0 auto',display:'flex',alignItems:'center',gap:16,height:56}}>
          <div style={{flex:1}}>
            <div style={{fontWeight:700,fontSize:15,color:'#1a1a2e'}}>GCHSS Timetable System</div>
            <div style={{fontSize:10,color:'#9ca3af'}}>Session 2025–26</div>
          </div>
          <label style={{display:'flex',alignItems:'center',gap:6,padding:'7px 14px',borderRadius:8,border:'1px solid #e5e7eb',fontSize:12,fontWeight:600,cursor:'pointer',color:'#6b7280'}}>
            📁 Import CSV
            <input type="file" accept=".csv" onChange={handleFileUpload} style={{display:'none'}}/>
          </label>
          <button onClick={handlePrint} style={{padding:'7px 14px',borderRadius:8,background:'#10a37f',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>
            🖨️ Print — {masterDay}
          </button>
        </div>
        <div style={{maxWidth:1400,margin:'0 auto',display:'flex',gap:2,overflowX:'auto',paddingBottom:1}}>
          {TABS.map(t=><button key={t.id} onClick={()=>setTab(t.id)} style={tb(t.id)}>{t.label}</button>)}
        </div>
      </div>

      <div style={{flex:1,padding:'20px',maxWidth:1400,margin:'0 auto',width:'100%'}}>

        {/* CLASS WISE */}
        {tab==='timetable'&&(
          <div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:18}}>
              {classes.map(c=><button key={c} onClick={()=>setSelClass(c)} style={clsBtn(c,selClass===c)}>{c}</button>)}
            </div>
            <div style={card}>
              <div style={{padding:'14px 20px',borderBottom:'1px solid #e5e7eb',fontWeight:700,fontSize:15}}>Class {selClass} — Weekly Timetable</div>
              <div style={{overflowX:'auto'}}>
                <table style={{borderCollapse:'collapse',width:'100%'}}>
                  <thead>
                    <tr style={{background:'#1a1a2e'}}>
                      <th style={{padding:'10px 14px',textAlign:'left',color:'#fff',fontSize:12,minWidth:90}}>Day</th>
                      {[1,2,3,'B',4,5,6,7].map((h,i)=>(
                        <th key={i} style={{padding:'9px 8px',color:h==='B'?'#10a37f':'#fff',background:h==='B'?'#e6f7f4':undefined,fontWeight:600,minWidth:h==='B'?34:115,fontSize:11,border:'1px solid #2d2d4e'}}>
                          {h==='B'?'☕':`P${h}`}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {DAYS.map((day,di)=>{
                      const maxP=day==='Friday'?5:7;
                      const dayT=day==='Friday'?timings.friday:timings.regular;
                      return(
                        <tr key={day} style={{background:di%2===0?'#fff':'#fafbfc'}}>
                          <td style={{padding:'10px 14px',fontWeight:600,fontSize:13,border:'1px solid #e5e7eb'}}>{day}</td>
                          {[1,2,3,'B',4,5,6,7].map((p,ci)=>{
                            if(p==='B')return<td key="br" style={{background:'#e6f7f4',textAlign:'center',padding:6,border:'1px solid #e5e7eb'}}>☕</td>;
                            const isOff=p>maxP;
                            const tIdx=p<=3?p-1:p-2;
                            const time=dayT[tIdx]||{};
                            const sl=dispTT[day]?.[p]?.[selClass];
                            return(
                              <td key={p} style={{padding:6,verticalAlign:'top',border:'1px solid #e5e7eb',background:isOff?'#f9fafb':undefined}}>
                                {isOff?<div style={{textAlign:'center',color:'#e5e7eb',padding:8}}>—</div>
                                  :sl?(
                                    <div style={{borderRadius:8,padding:'7px 9px',background:gc(sl.subject)+'12',borderLeft:`3px solid ${gc(sl.subject)}`}}>
                                      <div style={{fontSize:9,color:'#9ca3af',marginBottom:2}}>{time.start}–{time.end}</div>
                                      <div style={{fontWeight:700,fontSize:12,color:gc(sl.subject)}}>{sl.subject}</div>
                                      <div style={{fontSize:11,color:'#6b7280',marginTop:2}}>{gT(sl.teacherId)?.name||'—'}</div>
                                      {sl.isSub&&<div style={{fontSize:9,background:'#e6f7f4',color:'#10a37f',borderRadius:4,padding:'2px 5px',marginTop:3,fontWeight:700}}>⇄ SUB</div>}
                                    </div>
                                  ):<div style={{textAlign:'center',color:'#e5e7eb',padding:8}}>—</div>}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* MASTER VIEW */}
        {tab==='master'&&(
          <div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:18,alignItems:'center'}}>
              {DAYS.map(d=><button key={d} onClick={()=>setMasterDay(d)} style={dayBtn(d,masterDay===d)}>{d}</button>)}
              <button onClick={handlePrint} style={{marginLeft:'auto',padding:'7px 16px',borderRadius:8,background:'#10a37f',color:'#fff',border:'none',fontSize:12,fontWeight:600,cursor:'pointer'}}>🖨️ Print</button>
            </div>
            {(absences[masterDay]||[]).length>0&&(
              <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'10px 16px',marginBottom:14,fontSize:12,color:'#ef4444'}}>
                ⚠ <strong>Absent:</strong> {(absences[masterDay]||[]).map(id=>gT(id)?.name).filter(Boolean).join(', ')}
              </div>
            )}
            <div style={card}>
              <div style={{padding:'14px 20px',borderBottom:'1px solid #e5e7eb',fontWeight:700,fontSize:15}}>Master Schedule — {masterDay}</div>
              <div style={{overflowX:'auto'}}>
                <table style={{borderCollapse:'collapse',width:'100%'}}>
                  <thead>
                    <tr style={{background:'#1a1a2e'}}>
                      <th style={{padding:'10px 12px',textAlign:'left',color:'#fff',fontSize:12,minWidth:70,border:'1px solid #2d2d4e'}}>Class</th>
                      {Array.from({length:masterDay==='Friday'?5:7},(_,i)=>{
                        const p=i+1,dayT=masterDay==='Friday'?timings.friday:timings.regular,t=dayT[i]||{};
                        return[
                          p===4&&<th key="br" style={{background:'#e6f7f4',padding:'6px 4px',minWidth:26,border:'1px solid #e5e7eb'}}>☕</th>,
                          <th key={p} style={{padding:'9px 8px',color:'#fff',fontWeight:600,fontSize:11,minWidth:108,border:'1px solid #2d2d4e'}}>P{p}<br/><span style={{fontWeight:400,fontSize:9}}>{t.start}–{t.end}</span></th>
                        ];
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {classes.map((c,ci)=>(
                      <tr key={c} style={{background:ci%2===0?'#fff':'#fafbfc'}}>
                        <td style={{padding:'7px 12px',fontWeight:700,fontSize:12,border:'1px solid #e5e7eb'}}>{c}</td>
                        {Array.from({length:masterDay==='Friday'?5:7},(_,i)=>{
                          const p=i+1,sl=dispTT[masterDay]?.[p]?.[c];
                          return[
                            p===4&&<td key="br" style={{background:'#e6f7f4',border:'1px solid #e5e7eb'}}></td>,
                            <td key={p} style={{padding:5,verticalAlign:'top',border:'1px solid #e5e7eb'}}>
                              {sl?(
                                <div style={{borderRadius:6,padding:'4px 7px',background:gc(sl.subject)+'10',borderLeft:`2px solid ${gc(sl.subject)}`}}>
                                  <div style={{fontWeight:700,color:gc(sl.subject),fontSize:11}}>{sl.subject}</div>
                                  <div style={{color:'#6b7280',fontSize:10,marginTop:1}}>{gT(sl.teacherId)?.name||'—'}</div>
                                  {sl.isSub&&<span style={{fontSize:9,color:'#10a37f',fontWeight:700}}>⇄ SUB</span>}
                                </div>
                              ):<span style={{color:'#e5e7eb'}}>—</span>}
                            </td>
                          ];
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* SUBSTITUTES */}
        {tab==='substitute'&&(
          <div>
            <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:18,alignItems:'center'}}>
              {DAYS.map(d=>{const cnt=getSubList(d).length;return<button key={d} onClick={()=>setMasterDay(d)} style={{...dayBtn(d,masterDay===d),display:'flex',gap:6,alignItems:'center'}}>{d}{cnt>0&&<span style={{background:masterDay===d?'rgba(255,255,255,.3)':'#10a37f',color:'#fff',borderRadius:99,padding:'0 6px',fontSize:10,fontWeight:700}}>{cnt}</span>}</button>;})}
              <div style={{marginLeft:'auto',display:'flex',gap:8}}>
                {['grid','list'].map(v=><button key={v} onClick={()=>setSubView(v)} style={{padding:'6px 12px',borderRadius:8,border:`1.5px solid ${subView===v?'#10a37f':'#e5e7eb'}`,background:subView===v?'#e6f7f4':'#fff',color:subView===v?'#10a37f':'#6b7280',fontWeight:600,fontSize:12,cursor:'pointer'}}>{v==='grid'?'🔲 Grid':'📋 List'}</button>)}
              </div>
            </div>
            {(absences[masterDay]||[]).length===0?(
              <div style={{textAlign:'center',padding:'60px 20px',color:'#9ca3af'}}>
                <div style={{fontSize:40,marginBottom:12}}>✅</div>
                <div style={{fontSize:15,fontWeight:600,color:'#6b7280'}}>No absences on {masterDay}</div>
                <div style={{fontSize:13,marginTop:4}}>Mark teachers absent in the Absences tab.</div>
              </div>
            ):subView==='list'?(
              <div style={card}>
                <div style={{padding:'14px 20px',borderBottom:'1px solid #e5e7eb',display:'flex',alignItems:'center',gap:8}}>
                  <span style={{fontWeight:700,fontSize:15}}>🔄 Substitutes — {masterDay}</span>
                  <span style={{marginLeft:'auto',background:'#e6f7f4',color:'#10a37f',borderRadius:99,padding:'2px 10px',fontSize:11,fontWeight:700}}>{getSubList(masterDay).length} slots</span>
                </div>
                <table style={{borderCollapse:'collapse',width:'100%'}}>
                  <thead><tr style={{background:'#f9fafb'}}>{['Period','Class','Subject','Absent Teacher','Substitute'].map(h=><th key={h} style={{padding:'10px 14px',textAlign:'left',color:'#6b7280',fontWeight:600,fontSize:12,border:'1px solid #e5e7eb'}}>{h}</th>)}</tr></thead>
                  <tbody>{getSubList(masterDay).map((s,i)=>(
                    <tr key={i} style={{background:i%2===0?'#fff':'#fafbfc'}}>
                      <td style={{padding:'10px 14px',border:'1px solid #e5e7eb'}}><span style={{background:'#1a1a2e',color:'#fff',borderRadius:6,padding:'3px 9px',fontSize:12,fontWeight:700}}>P{s.period}</span></td>
                      <td style={{padding:'10px 14px',fontWeight:700,border:'1px solid #e5e7eb'}}>{s.cls}</td>
                      <td style={{padding:'10px 14px',border:'1px solid #e5e7eb'}}><span style={{background:gc(s.subject)+'15',color:gc(s.subject),borderRadius:6,padding:'3px 9px',fontSize:12,fontWeight:700}}>{s.subject}</span></td>
                      <td style={{padding:'10px 14px',border:'1px solid #e5e7eb',color:'#6b7280',textDecoration:'line-through'}}>{s.origTeacher}</td>
                      <td style={{padding:'10px 14px',border:'1px solid #e5e7eb',color:'#10a37f',fontWeight:700}}>{s.subTeacher}</td>
                    </tr>
                  ))}</tbody>
                </table>
              </div>
            ):(
              <div>
                {(absences[masterDay]||[]).map(id=>{
                  const teacher=gT(id);if(!teacher)return null;
                  const slots=getSubList(masterDay).filter(s=>s.origTeacher===teacher.name);
                  return(
                    <div key={id} style={{...card,marginBottom:14,overflow:'hidden'}}>
                      <div style={{padding:'12px 16px',background:'#fef2f2',borderBottom:'1px solid #fecaca',display:'flex',alignItems:'center',gap:10}}>
                        <div style={{width:34,height:34,borderRadius:10,background:'#ef4444',display:'flex',alignItems:'center',justifyContent:'center',color:'#fff',fontWeight:700,fontSize:14}}>{teacher.name.split(' ').map(w=>w[0]).slice(0,2).join('')}</div>
                        <div><div style={{fontWeight:700,fontSize:14,color:'#ef4444'}}>{teacher.name}</div><div style={{fontSize:11,color:'#9ca3af'}}>Absent — {slots.length} period{slots.length!==1?'s':''} to cover</div></div>
                      </div>
                      <div style={{padding:14,display:'flex',flexWrap:'wrap',gap:10}}>
                        {slots.map((s,i)=>(
                          <div key={i} style={{borderRadius:10,border:'1px solid #e5e7eb',padding:'10px 14px',minWidth:180}}>
                            <div style={{display:'flex',alignItems:'center',gap:6,marginBottom:6}}>
                              <span style={{background:'#1a1a2e',color:'#fff',borderRadius:5,padding:'2px 8px',fontSize:11,fontWeight:700}}>P{s.period}</span>
                              <span style={{fontWeight:700,fontSize:13}}>{s.cls}</span>
                              <span style={{background:gc(s.subject)+'15',color:gc(s.subject),borderRadius:5,padding:'2px 7px',fontSize:11,fontWeight:700,marginLeft:'auto'}}>{s.subject}</span>
                            </div>
                            <div style={{fontSize:12,color:'#10a37f',fontWeight:600}}>⇄ {s.subTeacher}</div>
                          </div>
                        ))}
                        {slots.length===0&&<div style={{color:'#9ca3af',fontSize:13}}>No substitutes assigned</div>}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* ABSENCE */}
        {tab==='absence'&&(
          <div>
            <div style={{...card,padding:20,marginBottom:16}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:16}}>❌ Mark Teacher Absences</div>
              <div style={{display:'flex',flexWrap:'wrap',gap:6,marginBottom:16}}>
                {DAYS.map(d=>{const cnt=(absences[d]||[]).length;return<button key={d} onClick={()=>setAbsDay(d)} style={{...dayBtn(d,absDay===d),display:'flex',alignItems:'center',gap:5}}>{d}{cnt>0&&<span style={{background:absDay===d?'rgba(255,255,255,.35)':'#ef4444',color:'#fff',borderRadius:99,padding:'0 6px',fontSize:10,fontWeight:700}}>{cnt}</span>}</button>;})}
              </div>
              <div style={{position:'relative',marginBottom:14}}>
                <input type="text" placeholder={`Search teacher on ${absDay}...`} value={search} onChange={e=>setSearch(e.target.value)} style={{width:'100%',padding:'9px 12px',border:'1.5px solid #e5e7eb',borderRadius:10,fontSize:13,outline:'none',background:'#f0f2f5'}}/>
                {search&&<button onClick={()=>setSearch('')} style={{position:'absolute',right:10,top:'50%',transform:'translateY(-50%)',background:'none',border:'none',cursor:'pointer',fontSize:16}}>×</button>}
              </div>
              {(absences[absDay]||[]).length>0&&(
                <div style={{background:'#fef2f2',border:'1px solid #fecaca',borderRadius:10,padding:'10px 14px',marginBottom:14,fontSize:12,color:'#ef4444',display:'flex',alignItems:'center',gap:6,flexWrap:'wrap'}}>
                  ⚠ <strong>{(absences[absDay]||[]).length} absent on {absDay}:</strong>
                  {(absences[absDay]||[]).map(id=>{const name=gT(id)?.name;return name&&<span key={id} style={{background:'#fee2e2',borderRadius:6,padding:'2px 8px',fontSize:11,display:'inline-flex',alignItems:'center',gap:4}}>{name}<button onClick={()=>toggleAbs(absDay,id)} style={{background:'none',border:'none',cursor:'pointer',padding:0,fontSize:12}}>×</button></span>;})}
                </div>
              )}
              <div style={{display:'flex',flexWrap:'wrap',gap:6}}>
                {filtTeachers.map(t=>{const isAbs=(absences[absDay]||[]).includes(t.id);return<button key={t.id} onClick={()=>toggleAbs(absDay,t.id)} style={{padding:'7px 14px',borderRadius:8,fontSize:12,fontWeight:600,border:`1.5px solid ${isAbs?'#ef4444':'#e5e7eb'}`,background:isAbs?'#ef4444':'#fff',color:isAbs?'#fff':'#6b7280',cursor:'pointer',display:'flex',alignItems:'center',gap:5}}>{isAbs?'✕':'✓'} {t.name}{t.isExtra&&<span style={{background:isAbs?'rgba(255,255,255,.2)':'#fffbeb',color:isAbs?'#fff':'#f59e0b',borderRadius:4,padding:'0 5px',fontSize:9,fontWeight:700}}>POOL</span>}</button>;})}
              </div>
            </div>
            <div style={{...card,overflow:'hidden'}}>
              <div style={{padding:'13px 20px',borderBottom:'1px solid #e5e7eb',fontWeight:700,fontSize:14}}>Weekly Absence Summary</div>
              <table style={{borderCollapse:'collapse',width:'100%'}}>
                <thead><tr style={{background:'#f9fafb'}}>{['Day','Absent Teachers'].map(h=><th key={h} style={{padding:'9px 14px',textAlign:'left',color:'#6b7280',fontWeight:600,fontSize:12,border:'1px solid #e5e7eb'}}>{h}</th>)}</tr></thead>
                <tbody>{DAYS.map(day=>{const list=(absences[day]||[]).map(id=>gT(id)?.name).filter(Boolean);return<tr key={day}><td style={{padding:'9px 14px',fontWeight:600,fontSize:13,border:'1px solid #e5e7eb'}}>{day}</td><td style={{padding:'9px 14px',border:'1px solid #e5e7eb'}}>{list.length?<div style={{display:'flex',flexWrap:'wrap',gap:4}}>{list.map(n=><span key={n} style={{background:'#fef2f2',color:'#ef4444',borderRadius:6,padding:'2px 9px',fontSize:11,fontWeight:600}}>{n}</span>)}</div>:<span style={{color:'#9ca3af',fontSize:12}}>All present</span>}</td></tr>;})}</tbody>
              </table>
            </div>
          </div>
        )}

        {/* TEACHERS */}
        {tab==='teachers'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
            <div style={{...card,padding:20}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:4}}>👥 Substitute Pool Teachers</div>
              <div style={{fontSize:12,color:'#9ca3af',marginBottom:16}}>Used first when a regular teacher is absent.</div>
              <div style={{display:'flex',gap:8,marginBottom:14}}>
                <input type="text" placeholder="Enter teacher full name..." value={newTeacherName} onChange={e=>setNewTeacherName(e.target.value)} onKeyDown={e=>e.key==='Enter'&&addExtraTeacher()} style={{flex:1,padding:'9px 12px',border:'1.5px solid #e5e7eb',borderRadius:9,fontSize:13,outline:'none',background:'#f0f2f5'}}/>
                <button onClick={addExtraTeacher} style={{padding:'9px 16px',borderRadius:9,background:'#10a37f',color:'#fff',border:'none',fontSize:13,fontWeight:600,cursor:'pointer'}}>+ Add</button>
              </div>
              <div style={{display:'flex',flexDirection:'column',gap:6}}>
                {extraTeachers.map(name=>(
                  <div key={name} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 12px',borderRadius:9,border:'1px solid #e5e7eb'}}>
                    <span style={{flex:1,fontSize:13,fontWeight:500}}>{name}</span>
                    <span style={{background:'#fffbeb',color:'#f59e0b',borderRadius:5,padding:'1px 7px',fontSize:10,fontWeight:700}}>POOL</span>
                    <button onClick={()=>removeExtraTeacher(name)} style={{background:'none',border:'none',cursor:'pointer',fontSize:16,color:'#9ca3af'}}>🗑</button>
                  </div>
                ))}
              </div>
            </div>
            <div style={{...card,padding:20}}>
              <div style={{fontWeight:700,fontSize:15,marginBottom:14}}>📋 Assigned Teachers</div>
              <div style={{display:'flex',flexDirection:'column',gap:5,maxHeight:440,overflowY:'auto'}}>
                {teachers.filter(t=>!t.isExtra).map((t,i)=>{
                  const subjects=[];
                  Object.entries(assignments).forEach(([cls,subjs])=>{Object.entries(subjs).forEach(([subj,tName])=>{if(tName===t.name)subjects.push(`${cls}/${subj}`);});});
                  return(
                    <div key={t.id} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',borderRadius:9,border:'1px solid #e5e7eb',background:i%2===0?'#fff':'#fafbfc'}}>
                      <div style={{flex:1}}><div style={{fontSize:13,fontWeight:600}}>{t.name}</div><div style={{fontSize:10,color:'#9ca3af',marginTop:1}}>{subjects.slice(0,4).join(', ')}{subjects.length>4?` +${subjects.length-4} more`:''}</div></div>
                      <span style={{background:'#e8f0fe',color:'#1a73e8',borderRadius:5,padding:'1px 7px',fontSize:10,fontWeight:700}}>{subjects.length} cls</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* TIMINGS */}
        {tab==='timings'&&(
          <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:18}}>
            {[{label:'Regular Days (Mon–Thu, Sat)',key:'regular'},{label:'Friday',key:'friday'}].map(({label,key})=>(
              <div key={key} style={{...card,padding:20}}>
                <div style={{fontWeight:700,fontSize:14,marginBottom:16}}>⚙️ {label}</div>
                {timings[key].map((t,idx)=>(
                  <div key={idx} style={{display:'flex',alignItems:'center',gap:10,marginBottom:10}}>
                    <span style={{fontSize:12,color:'#6b7280',minWidth:60,fontWeight:600}}>P{idx+1}</span>
                    <input type="time" value={t.start} onChange={e=>{const u=[...timings[key]];u[idx]={...u[idx],start:e.target.value};setTimings({...timings,[key]:u});}} style={{padding:'6px 10px',border:'1.5px solid #e5e7eb',borderRadius:8,fontSize:12,outline:'none'}}/>
                    <span style={{color:'#9ca3af'}}>→</span>
                    <input type="time" value={t.end} onChange={e=>{const u=[...timings[key]];u[idx]={...u[idx],end:e.target.value};setTimings({...timings,[key]:u});}} style={{padding:'6px 10px',border:'1.5px solid #e5e7eb',borderRadius:8,fontSize:12,outline:'none'}}/>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}

        {/* WORKLOAD */}
        {tab==='workload'&&(
          <div style={{...card,overflow:'hidden'}}>
            <div style={{padding:'14px 20px',borderBottom:'1px solid #e5e7eb',fontWeight:700,fontSize:15}}>📊 Weekly Teacher Workload</div>
            <table style={{borderCollapse:'collapse',width:'100%'}}>
              <thead><tr style={{background:'#1a1a2e'}}>{['#','Teacher','Type','Base Periods','Substitutions','Total'].map(h=><th key={h} style={{padding:'10px 16px',textAlign:'left',fontWeight:600,color:'#fff',fontSize:12,border:'1px solid #2d2d4e'}}>{h}</th>)}</tr></thead>
              <tbody>
                {teachers.map((t,ti)=>{
                  let reg=0,subs=0;
                  DAYS.forEach(d=>{const maxP=d==='Friday'?5:7;for(let p=1;p<=maxP;p++){classes.forEach(c=>{const sl=dispTT[d]?.[p]?.[c];if(sl?.teacherId===t.id)sl.isSub?subs++:reg++;});}});
                  return(
                    <tr key={t.id} style={{background:ti%2===0?'#fff':'#fafbfc'}}>
                      <td style={{padding:'9px 16px',color:'#9ca3af',fontSize:11,border:'1px solid #e5e7eb'}}>{ti+1}</td>
                      <td style={{padding:'9px 16px',border:'1px solid #e5e7eb',fontWeight:600,fontSize:13}}>{t.name}</td>
                      <td style={{padding:'9px 16px',border:'1px solid #e5e7eb'}}><span style={{background:t.isExtra?'#fffbeb':'#e8f0fe',color:t.isExtra?'#f59e0b':'#1a73e8',borderRadius:5,padding:'2px 8px',fontSize:11,fontWeight:700}}>{t.isExtra?'POOL':'ASSIGNED'}</span></td>
                      <td style={{padding:'9px 16px',border:'1px solid #e5e7eb'}}><span style={{background:'#dbeafe',color:'#1d4ed8',borderRadius:99,padding:'2px 12px',fontWeight:700,fontSize:12}}>{reg}</span></td>
                      <td style={{padding:'9px 16px',border:'1px solid #e5e7eb'}}><span style={{background:subs>0?'#e6f7f4':'#f9fafb',color:subs>0?'#10a37f':'#9ca3af',borderRadius:99,padding:'2px 12px',fontWeight:700,fontSize:12}}>+{subs}</span></td>
                      <td style={{padding:'9px 16px',border:'1px solid #e5e7eb'}}><span style={{background:'#dcfce7',color:'#15803d',borderRadius:99,padding:'2px 12px',fontWeight:700,fontSize:12}}>{reg+subs}</span></td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

      </div>
    </div>
  );
}

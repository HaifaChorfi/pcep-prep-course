// ─────────────────────────────────────────────────────────────────────────────
//  QCM TP3 — Structures Conditionnelles  |  PCEP Module 3  |  ISET Béja
//  Firebase Realtime Database  ·  GitHub Pages
//  Chronomètre 60s strict par question (passage automatique)
// ─────────────────────────────────────────────────────────────────────────────
import { useState, useEffect } from "react";
import { db } from "./firebase";
import { ref, set, remove, onValue } from "firebase/database";

// ═══════════════════════════════════════════════════════════════════════════
// QUESTIONS — 10 questions PCEP Module 3
// ═══════════════════════════════════════════════════════════════════════════
const QUESTIONS = [
  // ── Niveau 1 ─────────────────────────────────────────────────────────────
  {
    id: 1, niveau: 1, theme: "if / else — parité",
    code: `n = int(input("Nombre : "))  # saisie : 7
if n % 2 == 0:
    print("pair")
else:
    print("impair")`,
    question: "Quelle est la sortie pour n = 7 ?",
    options: ["pair", "impair", "0", "SyntaxError"],
    correct: 1,
    explication: [
      "7 % 2 = 1  (reste de 7 ÷ 2)",
      "1 == 0  est False  →  le bloc else s'exécute",
      "→  Sortie : impair",
    ],
  },
  {
    id: 2, niveau: 1, theme: "= vs == — piège PCEP",
    code: `x = 10
if x = 10:
    print("ok")`,
    question: "Que se passe-t-il à l'exécution ?",
    options: ["Affiche : ok", "Affiche : True", "SyntaxError", "NameError"],
    correct: 2,
    explication: [
      "= est l'opérateur d'affectation — il ne peut PAS être utilisé dans un if.",
      "Python attend une expression booléenne après if.",
      "→  SyntaxError  ·  Correction : if x == 10:",
    ],
  },
  {
    id: 3, niveau: 1, theme: "if / elif / else — signe",
    code: `n = 0
if n > 0:
    print("positif")
elif n < 0:
    print("négatif")
else:
    print("nul")`,
    question: "Quelle est la sortie ?",
    options: ["positif", "négatif", "nul", "Rien"],
    correct: 2,
    explication: [
      "n = 0  →  n > 0 est False  →  n < 0 est False",
      "Toutes les conditions elif sont False  →  le bloc else s'exécute",
      "→  Sortie : nul",
    ],
  },
  // ── Niveau 2 ─────────────────────────────────────────────────────────────
  {
    id: 4, niveau: 2, theme: "Ordre des elif — mention",
    code: `moy = 14.0
if moy >= 10:
    print("Passable")
elif moy >= 14:
    print("Bien")
elif moy >= 16:
    print("Très bien")`,
    question: "Quelle est la sortie pour moy = 14.0 ?",
    options: ["Très bien", "Bien", "Passable", "Rien"],
    correct: 2,
    explication: [
      "elif s'arrête à la PREMIÈRE condition vraie.",
      "moy >= 10 est True (14 >= 10)  →  Python affiche 'Passable' et s'arrête.",
      "moy >= 14 ne sera JAMAIS testé !",
      "⚠️  Piège PCEP : toujours tester du + restrictif au + général.",
    ],
  },
  {
    id: 5, niveau: 2, theme: "Plusieurs if vs elif",
    code: `x = 15
if x > 10:
    print("A")
if x > 12:
    print("B")
if x > 20:
    print("C")`,
    question: "Quelle est la sortie complète ?",
    options: ["A", "AB", "ABC", "B"],
    correct: 1,
    explication: [
      "Trois if INDÉPENDANTS — toutes les conditions sont évaluées.",
      "x > 10 : True  →  affiche A",
      "x > 12 : True  →  affiche B",
      "x > 20 : False →  rien",
      "→  Sortie : A puis B (deux lignes séparées)",
    ],
  },
  {
    id: 6, niveau: 2, theme: "Opérateurs logiques — and",
    code: `age = 20
permis = True
if age >= 18 and permis == True:
    print("Peut conduire")
else:
    print("Ne peut pas conduire")`,
    question: "Quelle est la sortie ?",
    options: ["Peut conduire", "Ne peut pas conduire", "True", "SyntaxError"],
    correct: 0,
    explication: [
      "age >= 18  →  True  (20 >= 18)",
      "permis == True  →  True",
      "True and True  →  True  →  le bloc if s'exécute",
      "→  Sortie : Peut conduire",
    ],
  },
  {
    id: 7, niveau: 2, theme: "Opérateurs logiques — not",
    code: `connecte = False
if not connecte:
    print("Accès refusé")
else:
    print("Bienvenue")`,
    question: "Quelle est la sortie ?",
    options: ["Bienvenue", "Accès refusé", "False", "NameError"],
    correct: 1,
    explication: [
      "not connecte  =  not False  =  True",
      "La condition est True  →  le bloc if s'exécute",
      "→  Sortie : Accès refusé",
      "Rappel : not inverse la valeur booléenne.",
    ],
  },
  // ── Niveau 3 ─────────────────────────────────────────────────────────────
  {
    id: 8, niveau: 3, theme: "Priorité : not > and > or",
    code: `a = True
b = False
c = True
print(a or b and not c)`,
    question: "Quelle est la sortie ?",
    options: ["True", "False", "None", "SyntaxError"],
    correct: 0,
    explication: [
      "Priorité : not > and > or",
      "Étape 1 : not c   =  not True  =  False",
      "Étape 2 : b and False  =  False and False  =  False",
      "Étape 3 : a or False   =  True or False  =  True",
      "→  Sortie : True",
    ],
  },
  {
    id: 9, niveau: 3, theme: "Conditions imbriquées",
    code: `note = 15
mention = ""
if note >= 10:
    if note >= 14:
        mention = "Bien"
    else:
        mention = "Passable"
else:
    mention = "Ajourné"
print(mention)`,
    question: "Quelle est la sortie ?",
    options: ["Ajourné", "Passable", "Bien", ""],
    correct: 2,
    explication: [
      "note = 15  →  note >= 10 est True  →  on entre dans le if externe",
      "Dans le bloc : note >= 14 est True (15 >= 14)  →  mention = 'Bien'",
      "→  Sortie : Bien",
      "Les conditions imbriquées permettent de tester plusieurs critères.",
    ],
  },
  {
    id: 10, niveau: 3, theme: "Synthèse — validation saisie",
    code: `choix = input("P/F/C : ")  # saisie : "X"
if choix not in ["P", "F", "C"]:
    print("Invalide")
elif choix == "P":
    print("Pierre")
else:
    print("Feuille ou Ciseaux")`,
    question: 'Quelle est la sortie pour choix = "X" ?',
    options: ["Pierre", "Feuille ou Ciseaux", "Invalide", "NameError"],
    correct: 2,
    explication: [
      '"X" not in ["P", "F", "C"]  →  True',
      "La première condition est True  →  affiche 'Invalide' et s'arrête",
      "not in [...] vérifie qu'une valeur n'est PAS dans la liste.",
      "Pattern courant à l'examen PCEP pour valider une saisie.",
    ],
  },
];

// ═══════════════════════════════════════════════════════════════════════════
// CONSTANTES
// ═══════════════════════════════════════════════════════════════════════════
const TEACHER_PWD = "iset2025";
const DB_KEY      = "qcm_tp3";
const TIME_LIMIT  = 60;

const NIV = {
  1: { bg: "#E8F5E9", border: "#27AE60", color: "#1E7E4C", label: "Niveau 1 — Découverte" },
  2: { bg: "#E3F2FD", border: "#2E86C1", color: "#1A5276", label: "Niveau 2 — Logique & ordre" },
  3: { bg: "#FFF3E0", border: "#E67E22", color: "#B07A00", label: "Niveau 3 — Synthèse" },
};

// ═══════════════════════════════════════════════════════════════════════════
// FIREBASE
// ═══════════════════════════════════════════════════════════════════════════
async function saveResult(name, answers) {
  const key = name.trim().replace(/\s+/g,"_").replace(/[.#$[\]]/g,"");
  await set(ref(db, `${DB_KEY}/${key}`), {
    name, answers,
    score: answers.filter(a => a.correct).length,
    total: answers.length,
    timedOutCount: answers.filter(a => a.timedOut).length,
    submittedAt: new Date().toISOString(),
  });
}
async function clearAll() { await remove(ref(db, DB_KEY)); }

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : Bloc de code Python colorisé
// ═══════════════════════════════════════════════════════════════════════════
function CodeBlock({ code }) {
  return (
    <div style={{
      background:"#0D1F2D", borderRadius:10, padding:"12px 16px",
      fontFamily:"'Courier New',monospace", fontSize:12.5, lineHeight:1.9,
      border:"1px solid #1A4A7A", marginBottom:16, overflowX:"auto",
    }}>
      {code.split("\n").map((line, i) => {
        const isComment = line.trim().startsWith("#");
        const parts = [];
        if (isComment) {
          parts.push(<span key="c" style={{ color:"#4A8AA8", fontStyle:"italic" }}>{line}</span>);
        } else {
          const strRe = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')/g;
          let last = 0, m;
          while ((m = strRe.exec(line)) !== null) {
            if (m.index > last) parts.push(<span key={last} style={{ color:"#E8F4FB" }}>{line.slice(last, m.index)}</span>);
            parts.push(<span key={m.index} style={{ color:"#F0A500" }}>{m[0]}</span>);
            last = m.index + m[0].length;
          }
          if (last < line.length) parts.push(<span key={last} style={{ color:"#E8F4FB" }}>{line.slice(last)}</span>);
        }
        return (
          <div key={i} style={{ display:"flex", gap:10 }}>
            <span style={{ color:"#2A5A7A", minWidth:16, fontSize:10, userSelect:"none", paddingTop:2 }}>{i+1}</span>
            <span>{parts}</span>
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : Tableau de bord enseignant
// ═══════════════════════════════════════════════════════════════════════════
function TeacherDashboard({ onBack }) {
  const [results, setResults]   = useState([]);
  const [loading, setLoading]   = useState(true);
  const [selQ, setSelQ]         = useState(null);

  useEffect(() => {
    const unsub = onValue(ref(db, DB_KEY), snap => {
      const data = snap.exists() ? Object.values(snap.val()) : [];
      data.sort((a, b) => b.score - a.score);
      setResults(data);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const total   = results.length;
  const avgScore = total ? (results.reduce((s,r)=>s+r.score,0)/total).toFixed(1) : 0;
  const avgPct   = total ? Math.round(results.reduce((s,r)=>s+r.score/r.total,0)/total*100) : 0;
  const finished = results.filter(r=>r.total===QUESTIONS.length).length;
  const avgTimeout = total ? Math.round(results.reduce((s,r)=>s+(r.timedOutCount||0),0)/total*10)/10 : 0;

  const qStats = QUESTIONS.map(q => {
    const ans = results.filter(r=>r.answers?.find(a=>a.qid===q.id));
    const ok  = results.filter(r=>r.answers?.find(a=>a.qid===q.id&&a.correct));
    return { q, answered:ans.length, correct:ok.length, pct:ans.length?Math.round(ok.length/ans.length*100):null };
  });

  const F = "'Trebuchet MS',sans-serif";
  return (
    <div style={{ minHeight:"100vh", background:"#0D1F2D", fontFamily:F, color:"#E8F4FB" }}>
      {/* Header */}
      <div style={{ background:"#0F2A45", borderBottom:"3px solid #E67E22", padding:"14px 22px", display:"flex", alignItems:"center", justifyContent:"space-between", flexWrap:"wrap", gap:10 }}>
        <div>
          <h1 style={{ margin:0, fontSize:19, fontWeight:800, color:"#E67E22" }}>📊 Tableau de bord — TP3 Module 3</h1>
          <p style={{ margin:0, fontSize:11, color:"#5B7A9A" }}>Structures Conditionnelles · if / elif / else · and · or · not · Temps réel Firebase</p>
        </div>
        <div style={{ display:"flex", gap:8 }}>
          <button onClick={async()=>{ if(window.confirm("Effacer tous les résultats ?")) await clearAll(); }}
            style={{ background:"#C0392B", color:"#fff", border:"none", borderRadius:7, padding:"7px 14px", cursor:"pointer", fontWeight:700, fontSize:12 }}>🗑 Réinitialiser</button>
          <button onClick={onBack} style={{ background:"#1A3A5A", color:"#5B7A9A", border:"none", borderRadius:7, padding:"7px 14px", cursor:"pointer", fontSize:12 }}>← Retour</button>
        </div>
      </div>

      <div style={{ padding:"18px 22px" }}>
        {/* KPIs */}
        <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))", gap:12, marginBottom:20 }}>
          {[
            { label:"Étudiants",   value:total,        sub:"connectés",      color:"#00B4D8", icon:"👥" },
            { label:"Score moyen", value:`${avgScore}/${QUESTIONS.length}`, sub:"bonnes rép.", color:"#2ECC71", icon:"📈" },
            { label:"Réussite",    value:avgPct+"%",   sub:"moyenne",        color:"#E67E22", icon:"🎯" },
            { label:"Terminé",     value:finished,     sub:"étudiants",      color:"#9B59B6", icon:"✅" },
            { label:"Temps écoulés",value:avgTimeout,  sub:"moy / étudiant", color:"#E74C3C", icon:"⏰" },
          ].map((k,i)=>(
            <div key={i} style={{ background:"#0F2A45", borderRadius:11, padding:"14px 16px", border:`1px solid ${k.color}33` }}>
              <div style={{ fontSize:20 }}>{k.icon}</div>
              <div style={{ fontSize:24, fontWeight:800, color:k.color }}>{loading?"…":k.value}</div>
              <div style={{ fontSize:11, color:"#5B7A9A" }}>{k.label}</div>
              <div style={{ fontSize:10, color:k.color }}>{k.sub}</div>
            </div>
          ))}
        </div>

        <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:16 }}>
          {/* Classement */}
          <div style={{ background:"#0F2A45", borderRadius:11, padding:16, border:"1px solid #1A4A7A" }}>
            <h3 style={{ margin:"0 0 12px", color:"#E67E22", fontSize:14 }}>🏆 Classement en direct</h3>
            {loading ? <p style={{ color:"#5B7A9A" }}>Connexion Firebase…</p>
              : results.length===0 ? <p style={{ color:"#5B7A9A", fontSize:12 }}>En attente des résultats…</p>
              : (
              <div style={{ maxHeight:320, overflowY:"auto" }}>
                {results.map((r,i)=>{
                  const pct=Math.round(r.score/r.total*100);
                  const medal=i===0?"🥇":i===1?"🥈":i===2?"🥉":`${i+1}.`;
                  return (
                    <div key={r.name} style={{ display:"flex", alignItems:"center", gap:7, padding:"6px 0", borderBottom:"1px solid #1A3A5A" }}>
                      <span style={{ fontSize:13, minWidth:24 }}>{medal}</span>
                      <span style={{ flex:1, fontSize:12, fontWeight:i<3?700:400, color:i<3?"#E8F4FB":"#8AACBF" }}>{r.name}</span>
                      {(r.timedOutCount||0)>0 && <span style={{ fontSize:10, color:"#E74C3C" }}>⏰×{r.timedOutCount}</span>}
                      <span style={{ fontSize:12, color:pct>=70?"#2ECC71":pct>=50?"#E67E22":"#E74C3C", fontWeight:700 }}>{r.score}/{r.total}</span>
                      <div style={{ width:52 }}>
                        <div style={{ background:"#1A3A5A", borderRadius:3, height:5, overflow:"hidden" }}>
                          <div style={{ width:`${pct}%`, height:"100%", background:pct>=70?"#2ECC71":pct>=50?"#E67E22":"#E74C3C", transition:"width 0.5s" }}/>
                        </div>
                        <div style={{ fontSize:9, color:"#5B7A9A", textAlign:"right", marginTop:1 }}>{pct}%</div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Stats par question */}
          <div style={{ background:"#0F2A45", borderRadius:11, padding:16, border:"1px solid #1A4A7A" }}>
            <h3 style={{ margin:"0 0 12px", color:"#00B4D8", fontSize:14 }}>📋 Résultats par question</h3>
            <div style={{ maxHeight:320, overflowY:"auto" }}>
              {qStats.map(({q,answered,pct})=>(
                <div key={q.id} onClick={()=>setSelQ(selQ?.id===q.id?null:q)} style={{ padding:"6px 0", borderBottom:"1px solid #1A3A5A", cursor:"pointer" }}>
                  <div style={{ display:"flex", alignItems:"center", gap:6, marginBottom:3 }}>
                    <span style={{ background:NIV[q.niveau].border+"33", color:NIV[q.niveau].border, borderRadius:3, padding:"1px 5px", fontSize:9, fontWeight:700 }}>N{q.niveau}</span>
                    <span style={{ flex:1, fontSize:11, color:"#8AACBF" }}>Q{q.id} — {q.theme}</span>
                    <span style={{ fontSize:10, color:"#5B7A9A" }}>{answered}</span>
                    {pct!==null && <span style={{ fontSize:11, fontWeight:700, color:pct>=70?"#2ECC71":pct>=50?"#E67E22":"#E74C3C" }}>{pct}%</span>}
                  </div>
                  {pct!==null && (
                    <div style={{ background:"#1A3A5A", borderRadius:3, height:4, overflow:"hidden" }}>
                      <div style={{ width:`${pct}%`, height:"100%", background:pct>=70?"#2ECC71":pct>=50?"#E67E22":"#E74C3C", transition:"width 0.5s" }}/>
                    </div>
                  )}
                  {selQ?.id===q.id && (
                    <div style={{ marginTop:7, background:"#0A1A2A", borderRadius:7, padding:9 }}>
                      <p style={{ margin:"0 0 5px", fontSize:10, color:"#E67E22", fontWeight:700 }}>{q.question}</p>
                      {q.options.map((opt,oi)=>{
                        const n=results.filter(r=>r.answers?.find(a=>a.qid===q.id&&a.chosen===oi)).length;
                        return (
                          <div key={oi} style={{ display:"flex", gap:5, margin:"2px 0" }}>
                            <span style={{ fontSize:10, color:oi===q.correct?"#2ECC71":"#5B7A9A", minWidth:12 }}>{oi===q.correct?"✓":"·"}</span>
                            <span style={{ fontSize:10, color:oi===q.correct?"#2ECC71":"#5B7A9A", flex:1 }}>{opt}</span>
                            <span style={{ fontSize:10, color:"#5B7A9A" }}>{n}</span>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : QCM Étudiant
// ═══════════════════════════════════════════════════════════════════════════
function StudentQCM({ studentName }) {
  const [current,    setCurrent]    = useState(0);
  const [selected,   setSelected]   = useState(null);
  const [confirmed,  setConfirmed]  = useState(false);
  const [answers,    setAnswers]    = useState([]);
  const [finished,   setFinished]   = useState(false);
  const [showExp,    setShowExp]    = useState(false);
  const [timer,      setTimer]      = useState(TIME_LIMIT);
  const [timedOut,   setTimedOut]   = useState(false);
  const [submitted,  setSubmitted]  = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const q   = QUESTIONS[current];
  const niv = NIV[q?.niveau] || NIV[1];

  // Reset à chaque nouvelle question
  useEffect(()=>{ setSelected(null); setConfirmed(false); setShowExp(false); setTimer(TIME_LIMIT); setTimedOut(false); }, [current]);

  // Compte à rebours strict 60s
  useEffect(()=>{
    if (confirmed || finished) return;
    if (timer <= 0) {
      setTimedOut(true);
      setConfirmed(true);
      setAnswers(prev=>[...prev,{ qid:q.id, chosen:null, correct:false, time:TIME_LIMIT, timedOut:true }]);
      return;
    }
    const id = setInterval(()=>setTimer(t=>t-1), 1000);
    return ()=>clearInterval(id);
  }, [timer, confirmed, finished, current]);

  const handleConfirm = () => {
    if (selected===null) return;
    setConfirmed(true);
    setAnswers(prev=>[...prev,{ qid:q.id, chosen:selected, correct:selected===q.correct, time:TIME_LIMIT-timer, timedOut:false }]);
  };

  const handleNext = () => {
    if (current<QUESTIONS.length-1) setCurrent(c=>c+1);
    else setFinished(true);
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    try { await saveResult(studentName, answers); setSubmitted(true); }
    catch { alert("Erreur d'envoi. Vérifiez votre connexion."); }
    finally { setSubmitting(false); }
  };

  const score    = answers.filter(a=>a.correct).length;
  const pct      = finished ? Math.round(score/QUESTIONS.length*100) : 0;
  const progress = current/QUESTIONS.length*100;
  const isCorrect = confirmed && selected===q.correct;
  const F = "'Trebuchet MS',sans-serif";

  // Couleurs chrono
  const timerColor  = timer<=10?"#C0392B":timer<=20?"#E67E22":"#5B7A9A";
  const timerBg     = timer<=10?"#FDECEA":timer<=20?"#FFF3E0":"#F8FBFE";
  const timerBorder = timer<=10?"#E74C3C":timer<=20?"#E67E22":"#DDE7F0";
  const barColor    = timer<=10?"#E74C3C":timer<=20?"#E67E22":"linear-gradient(90deg,#1A5276,#00B4D8)";

  // ── Écran résultats ──────────────────────────────────────
  if (finished) {
    const timedOutCount = answers.filter(a=>a.timedOut).length;
    return (
      <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#EAF4FB,#F4F9FD)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, padding:20 }}>
        <div style={{ background:"#fff", borderRadius:18, padding:"32px 40px", maxWidth:500, width:"100%", boxShadow:"0 8px 40px #1A527620", textAlign:"center" }}>
          <div style={{ fontSize:54, marginBottom:8 }}>{pct>=80?"🏆":pct>=60?"👍":"💪"}</div>
          <h2 style={{ fontSize:24, color:"#1A5276", margin:"0 0 4px" }}>{studentName}</h2>
          <p style={{ color:"#5B7A9A", marginBottom:20, fontSize:13 }}>TP3 — Structures Conditionnelles</p>

          {/* KPIs résultats */}
          <div style={{ display:"flex", justifyContent:"center", gap:12, marginBottom:18, flexWrap:"wrap" }}>
            {[
              { val:`${score}/${QUESTIONS.length}`, label:"Réponses", bg:"#E3F2FD", color:"#1A5276" },
              { val:`${pct}%`, label:"Score", bg:pct>=80?"#E8F5E9":pct>=60?"#FFF3E0":"#FDECEA", color:pct>=80?"#1E7E4C":pct>=60?"#B07A00":"#C0392B" },
              { val:`${timedOutCount}`, label:"Temps écoulés", bg:timedOutCount>0?"#FDECEA":"#E8F5E9", color:timedOutCount>0?"#C0392B":"#1E7E4C" },
            ].map((k,i)=>(
              <div key={i} style={{ background:k.bg, borderRadius:9, padding:"12px 16px", minWidth:90 }}>
                <div style={{ fontSize:26, fontWeight:800, color:k.color }}>{k.val}</div>
                <div style={{ fontSize:10, color:"#5B7A9A" }}>{k.label}</div>
              </div>
            ))}
          </div>

          {/* Détail par question */}
          <div style={{ background:"#F8FBFE", borderRadius:9, padding:"9px 12px", marginBottom:18, textAlign:"left" }}>
            {QUESTIONS.map((qq,i)=>{
              const ans=answers.find(a=>a.qid===qq.id);
              return (
                <div key={qq.id} style={{ display:"flex", gap:6, padding:"3px 0", borderBottom:i<QUESTIONS.length-1?"1px solid #EEF4F8":"none", alignItems:"center" }}>
                  <span style={{ fontSize:12 }}>{ans?.timedOut?"⏰":ans?.correct?"✅":"❌"}</span>
                  <span style={{ flex:1, fontSize:11, color:"#1A2E40" }}>Q{i+1} — {qq.theme}</span>
                  <span style={{ fontSize:10, color:ans?.timedOut?"#E67E22":"#5B7A9A", fontWeight:ans?.timedOut?700:400 }}>
                    {ans?.timedOut?"Temps !":ans?.time!=null?`${ans.time}s`:"—"}
                  </span>
                </div>
              );
            })}
          </div>

          {!submitted ? (
            <button onClick={handleSubmit} disabled={submitting}
              style={{ background:submitting?"#AAA":"#1A5276", color:"#fff", border:"none", borderRadius:9, padding:"12px 30px", fontSize:14, fontWeight:700, cursor:submitting?"default":"pointer", width:"100%" }}>
              {submitting?"⏳ Envoi…":"📤 Envoyer à l'enseignant"}
            </button>
          ) : (
            <div style={{ background:"#E8F5E9", border:"1px solid #2ECC71", borderRadius:9, padding:12, color:"#1E7E4C", fontWeight:700 }}>
              ✅ Résultats envoyés avec succès !
            </div>
          )}
        </div>
      </div>
    );
  }

  // ── Écran question ───────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#EAF4FB,#F4F9FD)", fontFamily:F, padding:"16px 12px" }}>
      <div style={{ maxWidth:680, margin:"0 auto" }}>

        {/* CSS animation pulse */}
        <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.7;transform:scale(1.06)}}`}</style>

        {/* Header */}
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:10, flexWrap:"wrap", gap:6 }}>
          <div>
            <h1 style={{ margin:0, fontSize:15, color:"#1A5276", fontWeight:800 }}>QCM TP3 — Module 3</h1>
            <p style={{ margin:0, fontSize:11, color:"#5B7A9A" }}>👤 {studentName}</p>
          </div>
          <div style={{ display:"flex", gap:6, alignItems:"center", flexWrap:"wrap" }}>
            <span style={{ background:"#E3F2FD", color:"#1A5276", borderRadius:6, padding:"3px 10px", fontSize:12, fontWeight:700 }}>Q{current+1}/{QUESTIONS.length}</span>
            {/* Chrono 60s strict */}
            <span style={{
              background:timerBg, color:timerColor, border:`2px solid ${timerBorder}`,
              borderRadius:6, padding:"3px 10px", fontSize:13, fontWeight:800, minWidth:50, textAlign:"center",
              animation:timer<=10&&!confirmed?"pulse 1s infinite":"none",
            }}>
              {confirmed ? "⏹" : timedOut ? "⏰ 0s" : `⏱ ${timer}s`}
            </span>
            {answers.length>0 && (
              <span style={{ background:"#E8F5E9", color:"#1E7E4C", borderRadius:6, padding:"3px 9px", fontSize:11, fontWeight:700, border:"1px solid #2ECC71" }}>
                ✅ {score}/{answers.length}
              </span>
            )}
          </div>
        </div>

        {/* Barre compte à rebours (se vide) */}
        {!confirmed && (
          <div style={{ background:"#DDE7F0", borderRadius:6, height:7, marginBottom:6, overflow:"hidden" }}>
            <div style={{ height:"100%", width:`${timer/TIME_LIMIT*100}%`, background:barColor, transition:"width 1s linear, background 0.3s" }}/>
          </div>
        )}

        {/* Barre progression globale */}
        <div style={{ background:"#EEF4F8", borderRadius:6, height:4, marginBottom:14, overflow:"hidden" }}>
          <div style={{ height:"100%", width:`${progress}%`, background:"#1A5276", transition:"width 0.4s" }}/>
        </div>

        {/* Badges niveau + thème */}
        <div style={{ display:"flex", gap:6, marginBottom:12, flexWrap:"wrap" }}>
          <span style={{ background:niv.bg, color:niv.color, border:`1px solid ${niv.border}`, borderRadius:5, padding:"2px 9px", fontSize:11, fontWeight:700 }}>{niv.label}</span>
          <span style={{ background:"#F8FBFE", color:"#5B7A9A", border:"1px solid #DDE7F0", borderRadius:5, padding:"2px 9px", fontSize:11 }}>{q.theme}</span>
        </div>

        {/* Card question */}
        <div style={{ background:"#fff", borderRadius:13, boxShadow:"0 4px 20px #1A527610", padding:"20px 22px", marginBottom:12 }}>
          <CodeBlock code={q.code}/>
          <p style={{ fontSize:15, fontWeight:700, color:"#1A2E40", marginBottom:14 }}>{q.question}</p>

          {/* Options 2×2 */}
          <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:8 }}>
            {q.options.map((opt,i)=>{
              let bg=selected===i?"#E3F2FD":"#F8FBFE";
              let border=selected===i?"2px solid #1A5276":"2px solid #DDE7F0";
              let color=selected===i?"#1A5276":"#1A2E40";
              let bbg=selected===i?"#1A5276":"#DDE7F0";
              let bcol=selected===i?"#fff":"#5B7A9A";
              if (confirmed) {
                if (i===q.correct)   { bg="#E8F5E9"; border="2px solid #27AE60"; color="#1E7E4C"; bbg="#27AE60"; bcol="#fff"; }
                else if (i===selected){ bg="#FDECEA"; border="2px solid #E74C3C"; color="#C0392B"; bbg="#E74C3C"; bcol="#fff"; }
                else                  { bg="#F8FBFE"; border="2px solid #DDE7F0"; color="#AAA"; bbg="#EEE"; bcol="#AAA"; }
              }
              return (
                <button key={i} onClick={()=>!confirmed&&setSelected(i)}
                  style={{ background:bg, border, borderRadius:8, padding:"10px 11px", textAlign:"left", cursor:confirmed?"default":"pointer", display:"flex", alignItems:"center", gap:8, transition:"all 0.18s" }}>
                  <span style={{ width:22, height:22, borderRadius:5, background:bbg, color:bcol, display:"flex", alignItems:"center", justifyContent:"center", fontSize:11, fontWeight:800, flexShrink:0 }}>
                    {String.fromCharCode(65+i)}
                  </span>
                  <span style={{ fontFamily:"'Courier New',monospace", fontSize:11.5, color, fontWeight:confirmed&&i===q.correct?700:400, wordBreak:"break-all" }}>{opt}</span>
                  {confirmed&&i===q.correct && <span style={{ marginLeft:"auto" }}>✅</span>}
                  {confirmed&&i===selected&&i!==q.correct && <span style={{ marginLeft:"auto" }}>❌</span>}
                </button>
              );
            })}
          </div>

          {/* Feedback */}
          {confirmed && (
            <div style={{ marginTop:12 }}>
              <div style={{ background:timedOut?"#FFF3E0":isCorrect?"#E8F5E9":"#FDECEA", border:`1px solid ${timedOut?"#E67E22":isCorrect?"#27AE60":"#E74C3C"}`, borderRadius:8, padding:"8px 11px", display:"flex", alignItems:"flex-start", gap:7, marginBottom:8 }}>
                <span style={{ fontSize:17, flexShrink:0 }}>{timedOut?"⏰":isCorrect?"🎉":"😅"}</span>
                <div>
                  <div style={{ fontWeight:700, color:timedOut?"#E67E22":isCorrect?"#1E7E4C":"#C0392B", fontSize:13 }}>
                    {timedOut?"Temps écoulé ! Passage automatique.":isCorrect?"Bonne réponse !":"Incorrect"}
                  </div>
                  {(timedOut||!isCorrect) && (
                    <div style={{ fontSize:11, color:"#666", marginTop:2 }}>
                      Réponse correcte : <strong style={{ fontFamily:"Courier New" }}>{q.options[q.correct]}</strong>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={()=>setShowExp(v=>!v)}
                style={{ background:"none", border:"1px solid #1A5276", color:"#1A5276", borderRadius:6, padding:"4px 10px", fontSize:11, cursor:"pointer", fontWeight:600 }}>
                {showExp?"▲ Masquer":"▼ Explication PCEP"}
              </button>
              {showExp && (
                <div style={{ marginTop:8, background:"#F8FBFE", border:"1px solid #DDE7F0", borderRadius:8, padding:"10px 12px" }}>
                  {q.explication.map((l,i)=>(
                    <p key={i} style={{ margin:"2px 0", fontSize:11.5, color:"#1A2E40",
                      fontFamily:l.startsWith("→")||l.includes("=")||l.includes("True")||l.includes("False")||l.includes("not")||l.includes("and")||l.includes("or")?"'Courier New'":"inherit" }}>
                      {l}
                    </p>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Boutons navigation */}
        <div style={{ display:"flex", justifyContent:"flex-end" }}>
          {!confirmed ? (
            <button onClick={handleConfirm} disabled={selected===null}
              style={{ background:selected!==null?"#1A5276":"#DDE7F0", color:selected!==null?"#fff":"#5B7A9A", border:"none", borderRadius:8, padding:"11px 24px", fontSize:14, fontWeight:700, cursor:selected!==null?"pointer":"default" }}>
              ✔ Valider
            </button>
          ) : (
            <button onClick={handleNext}
              style={{ background:"#1A5276", color:"#fff", border:"none", borderRadius:8, padding:"11px 24px", fontSize:14, fontWeight:700, cursor:"pointer" }}>
              {current<QUESTIONS.length-1?"Question suivante →":"Voir mes résultats 🏆"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// COMPOSANT : Écran de connexion
// ═══════════════════════════════════════════════════════════════════════════
function LoginScreen({ onStudent, onTeacher }) {
  const [name, setName]       = useState("");
  const [teacherMode, setTM]  = useState(false);
  const [pwd, setPwd]         = useState("");
  const [pwdErr, setPwdErr]   = useState(false);
  const F = "'Trebuchet MS',sans-serif";

  return (
    <div style={{ minHeight:"100vh", background:"linear-gradient(135deg,#0D1F2D 0%,#0F2A45 60%,#1A4A7A 100%)", display:"flex", alignItems:"center", justifyContent:"center", fontFamily:F, padding:20 }}>
      <div style={{ width:"100%", maxWidth:440 }}>
        {/* Logo */}
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{ fontSize:46, marginBottom:6 }}>🐍</div>
          <h1 style={{ fontSize:26, fontWeight:900, color:"#E67E22", margin:"0 0 4px" }}>QCM TP3</h1>
          <p style={{ color:"#5B7A9A", fontSize:13, margin:"0 0 8px" }}>PCEP — Module 3 · Structures Conditionnelles</p>
          <div style={{ display:"flex", justifyContent:"center", gap:5, flexWrap:"wrap" }}>
            {[1,2,3].map(n=>(
              <span key={n} style={{ background:NIV[n].border+"22", color:NIV[n].border, border:`1px solid ${NIV[n].border}`, borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:700 }}>N{n}</span>
            ))}
            <span style={{ background:"#1A4A7A", color:"#AED6F1", borderRadius:4, padding:"2px 8px", fontSize:10, fontWeight:700 }}>{QUESTIONS.length} questions · 60s/Q</span>
          </div>
        </div>

        {/* Card */}
        <div style={{ background:"#0F2A45", borderRadius:16, padding:"26px 30px", boxShadow:"0 20px 60px #0008", border:"1px solid #1A4A7A" }}>
          {!teacherMode ? (
            <>
              <h2 style={{ margin:"0 0 4px", color:"#E8F4FB", fontSize:16 }}>👤 Connexion étudiant</h2>
              <p style={{ color:"#5B7A9A", fontSize:11, marginBottom:18 }}>{QUESTIONS.length} questions · 3 niveaux · 60 secondes par question · Chrono strict</p>
              <label style={{ display:"block", color:"#8AACBF", fontSize:12, marginBottom:6, fontWeight:600 }}>Nom & Prénom</label>
              <input value={name} onChange={e=>setName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&name.trim().length>=3&&onStudent(name.trim())}
                placeholder="ex : Ben Ali Mohamed"
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:"2px solid #1A4A7A", background:"#0A1A2A", color:"#E8F4FB", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:F }}/>
              <p style={{ color:"#3A6A8A", fontSize:10, marginBottom:16 }}>Minimum 3 caractères</p>
              <button onClick={()=>onStudent(name.trim())} disabled={name.trim().length<3}
                style={{ width:"100%", background:name.trim().length>=3?"linear-gradient(90deg,#1A5276,#00B4D8)":"#1A3A5A", color:name.trim().length>=3?"#fff":"#3A6A8A", border:"none", borderRadius:8, padding:"12px", fontSize:14, fontWeight:800, cursor:name.trim().length>=3?"pointer":"default", transition:"all 0.2s" }}>
                🚀 Démarrer le QCM
              </button>
              <button onClick={()=>setTM(true)} style={{ width:"100%", background:"none", color:"#3A6A8A", border:"1px solid #1A3A5A", borderRadius:8, padding:"8px", fontSize:12, cursor:"pointer", marginTop:9 }}>
                🔐 Accès enseignant
              </button>
            </>
          ) : (
            <>
              <h2 style={{ margin:"0 0 4px", color:"#E67E22", fontSize:16 }}>🔐 Accès enseignant</h2>
              <p style={{ color:"#5B7A9A", fontSize:11, marginBottom:16 }}>Tableau de bord avec résultats en temps réel</p>
              <label style={{ display:"block", color:"#8AACBF", fontSize:12, marginBottom:6, fontWeight:600 }}>Mot de passe</label>
              <input type="password" value={pwd}
                onChange={e=>{ setPwd(e.target.value); setPwdErr(false); }}
                onKeyDown={e=>e.key==="Enter"&&(pwd===TEACHER_PWD?onTeacher():setPwdErr(true))}
                placeholder="••••••••"
                style={{ width:"100%", padding:"10px 12px", borderRadius:8, border:`2px solid ${pwdErr?"#E74C3C":"#1A4A7A"}`, background:"#0A1A2A", color:"#E8F4FB", fontSize:14, outline:"none", boxSizing:"border-box", fontFamily:F }}/>
              {pwdErr && <p style={{ color:"#E74C3C", fontSize:11, margin:"3px 0 6px" }}>Mot de passe incorrect</p>}
              <p style={{ color:"#3A6A8A", fontSize:10, marginBottom:16 }}>Indice : iset + année</p>
              <button onClick={()=>pwd===TEACHER_PWD?onTeacher():setPwdErr(true)}
                style={{ width:"100%", background:"linear-gradient(90deg,#E67E22,#D35400)", color:"#0F2A45", border:"none", borderRadius:8, padding:"12px", fontSize:14, fontWeight:800, cursor:"pointer" }}>
                📊 Tableau de bord
              </button>
              <button onClick={()=>{ setTM(false); setPwd(""); setPwdErr(false); }} style={{ width:"100%", background:"none", color:"#3A6A8A", border:"1px solid #1A3A5A", borderRadius:8, padding:"8px", fontSize:12, cursor:"pointer", marginTop:9 }}>
                ← Retour
              </button>
            </>
          )}
        </div>
        <p style={{ textAlign:"center", color:"#2A4A6A", fontSize:10, marginTop:12 }}>
          Résultats synchronisés en temps réel · Firebase · GitHub Pages
        </p>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════
// APP ROOT
// ═══════════════════════════════════════════════════════════════════════════
export default function App({ onBack }) {
  const [mode,        setMode]        = useState("login");
  const [studentName, setStudentName] = useState("");

  if (mode==="teacher") return <TeacherDashboard onBack={()=>setMode("login")}/>;
  if (mode==="student") return <StudentQCM studentName={studentName}/>;
  return (
    <LoginScreen
      onStudent={name=>{ setStudentName(name); setMode("student"); }}
      onTeacher={()=>setMode("teacher")}
    />
  );
}

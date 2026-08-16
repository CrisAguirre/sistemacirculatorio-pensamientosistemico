import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { examApi } from '../api/exam';
import './pages.css';

export default function Exam({ examId }) {
  const { id } = useParams();
  const simId = examId || id;

  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let active = true;
    setLoading(true);
    setExam(null);
    setAnswers({});
    setResult(null);
    examApi
      .getBySimulation(simId)
      .then((data) => {
        if (active) {
          setExam(data);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (active) {
          setError(err.message || 'Error al cargar la evaluación');
          setLoading(false);
        }
      });
    return () => {
      active = false;
    };
  }, [simId]);

  function selectSingle(qid, option) {
    setAnswers((a) => ({ ...a, [qid]: option }));
  }

  function toggleMultiple(qid, option) {
    setAnswers((a) => {
      const cur = Array.isArray(a[qid]) ? a[qid] : [];
      const next = cur.includes(option) ? cur.filter((o) => o !== option) : [...cur, option];
      return { ...a, [qid]: next };
    });
  }

  function isAnswered(q) {
    const v = answers[q.id];
    return q.subtype === 'multiple' ? Array.isArray(v) && v.length > 0 : !!v;
  }

  const allAnswered = exam ? exam.questions.every(isAnswered) : false;

  async function handleSubmit() {
    setSubmitting(true);
    setError('');
    try {
      const payload = {
        answers: exam.questions.map((q) => ({
          questionId: q.id,
          selected: q.subtype === 'multiple' ? answers[q.id] || [] : answers[q.id] ?? null,
        })),
      };
      const data = await examApi.submit(simId, payload);
      setResult(data);
    } catch (err) {
      setError(err.message || 'Error al enviar la evaluación');
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">Evaluación</h1>
        </div>
        <div className="placeholder"><p>Cargando evaluación…</p></div>
      </div>
    );
  }

  if (error && !exam) {
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">Evaluación</h1>
        </div>
        <div className="auth-error">{error}</div>
      </div>
    );
  }

  if (result) {
    const porcentaje = Math.round((result.score / result.total) * 100);
    return (
      <div className="page">
        <div className="page-header">
          <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
          <h1 className="page-title">Resultado</h1>
        </div>
        <div className="placeholder" style={{ padding: '2rem 0' }}>
          <div className="stat-value" style={{ fontSize: '3rem' }}>{result.score} / {result.total}</div>
          <p className="page-subtitle" style={{ margin: '0.5rem auto' }}>
            {porcentaje >= 80 ? 'Excelente, dominas el tema.' : porcentaje >= 60 ? 'Buen trabajo, puedes mejorar.' : 'Repasa el material y vuelve a intentarlo.'}
          </p>
          <div className="hero-actions" style={{ marginTop: '1.5rem' }}>
            <button className="btn btn-primary" onClick={() => { setResult(null); setAnswers({}); }}>Intentar de nuevo</button>
            <Link to="/laboratorio" className="btn btn-outline">Volver al Laboratorio</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <Link to="/laboratorio" className="back-link">← Volver al Laboratorio</Link>
        <h1 className="page-title">{exam.title}</h1>
        <p className="page-subtitle">
          Responde todas las preguntas. Las de selección múltiple piden marcar todas las opciones correctas.
        </p>
      </div>

      {exam.questions.map((q, i) => (
        <div className="exam-question" key={q.id}>
          <div className="exam-question-text">
            {i + 1}. {q.text}
            {q.subtype === 'multiple' && <span style={{ color: '#93c5fd', fontSize: '0.8rem' }}> (elige todas las correctas)</span>}
          </div>
          {q.options.map((opt) => {
            const selected = q.subtype === 'multiple'
              ? (answers[q.id] || []).includes(opt)
              : answers[q.id] === opt;
            return (
              <button
                key={opt}
                type="button"
                className={`exam-option${selected ? ' selected' : ''}`}
                onClick={() => (q.subtype === 'multiple' ? toggleMultiple(q.id, opt) : selectSingle(q.id, opt))}
              >
                {opt}
              </button>
            );
          })}
        </div>
      ))}

      {error && <div className="auth-error" style={{ marginBottom: '1rem' }}>{error}</div>}

      <button className="btn btn-primary" onClick={handleSubmit} disabled={!allAnswered || submitting}>
        {submitting ? 'Enviando...' : 'Enviar evaluación'}
      </button>
    </div>
  );
}

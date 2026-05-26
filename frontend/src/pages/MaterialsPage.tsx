import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { apiService } from '../services/apiService';
import styles from './MaterialsPage.module.css';

interface MaterialItem {
  id: number;
  title: string;
  description: string | null;
  subject: number;
  subject_name: string;
  uploaded_by_name: string | null;
  created_at: string;
}

interface SubjectItem {
  id: number;
  name: string;
}

export function MaterialsPage() {
  const { user } = useAuth();
  const { colors } = useTheme();
  const [materials, setMaterials] = useState<MaterialItem[]>([]);
  const [subjects, setSubjects] = useState<SubjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [newSubject, setNewSubject] = useState<number | null>(null);

  const isLecturer = user?.role === 'lecturer';

  const fetchData = async () => {
    try {
      const [materialsData, subjectsData] = await Promise.all([
        apiService.getMaterials(),
        isLecturer ? apiService.getSubjects() : Promise.resolve([]),
      ]);
      setMaterials(Array.isArray(materialsData) ? materialsData : []);
      setSubjects(Array.isArray(subjectsData) ? subjectsData : []);
    } catch (e) {
      setError('Nie udało się załadować materiałów');
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleAdd = async () => {
    if (!newTitle.trim() || !newSubject) {
      alert('Wpisz tytuł i wybierz przedmiot');
      return;
    }
    try {
      await apiService.createMaterial({
        title: newTitle,
        description: newDescription || '',
        subject: newSubject,
      });
      setShowForm(false);
      setNewTitle('');
      setNewDescription('');
      setNewSubject(null);
      fetchData();
    } catch (e) {
      alert('Nie udało się dodać materiału');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Na pewno usunąć?')) return;
    try {
      const response = await fetch(`/api/materials/${id}/`, {
        method: 'DELETE',
        headers: { 'Authorization': `Token ${localStorage.getItem('token')}` },
      });
      if (!response.ok) throw new Error('Błąd');
      setMaterials(prev => prev.filter(m => m.id !== id));
    } catch (e) {
      alert('Nie udało się usunąć materiału');
    }
  };

  const groupedBySubject = materials.reduce<Record<string, MaterialItem[]>>((acc, m) => {
    if (!acc[m.subject_name]) acc[m.subject_name] = [];
    acc[m.subject_name].push(m);
    return acc;
  }, {});

  if (loading) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.subtext1, textAlign: 'center', padding: '3rem' }}>Ładowanie materiałów...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <p style={{ color: colors.red, textAlign: 'center', padding: '3rem' }}>{error}</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <h1 className={styles.title} style={{ color: colors.text, margin: 0 }}>Materiały dydaktyczne</h1>
        {isLecturer && (
          <button
            onClick={() => setShowForm(!showForm)}
            style={{
              backgroundColor: colors.blue,
              color: '#fff',
              border: 'none',
              padding: '8px 16px',
              borderRadius: 8,
              fontWeight: 600,
              cursor: 'pointer',
            }}
          >
            {showForm ? 'Anuluj' : '+ Dodaj materiał'}
          </button>
        )}
      </div>

      {isLecturer && showForm && (
        <div style={{ backgroundColor: colors.mantle, padding: '1.25rem', borderRadius: 12, marginBottom: '1.5rem' }}>
          <h3 style={{ color: colors.text, margin: '0 0 0.75rem', fontSize: '1rem' }}>Nowy materiał</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div className={styles.field}>
              <label style={{ color: colors.subtext1, display: 'block', marginBottom: 4, fontSize: '0.85rem' }}>Przedmiot</label>
              <select
                value={newSubject ?? ''}
                onChange={e => setNewSubject(Number(e.target.value))}
                style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2, width: '100%', padding: '10px 12px', borderRadius: 8, border: '1px solid' }}
              >
                <option value="">— Wybierz przedmiot —</option>
                {subjects.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
            </div>
            <input
              placeholder="Tytuł"
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2, padding: '10px 12px', borderRadius: 8, border: '1px solid' }}
            />
            <textarea
              placeholder="Opis (opcjonalnie)"
              value={newDescription}
              onChange={e => setNewDescription(e.target.value)}
              style={{ backgroundColor: colors.surface0, color: colors.text, borderColor: colors.surface2, padding: '10px 12px', borderRadius: 8, border: '1px solid', resize: 'vertical', minHeight: 60 }}
            />
            <button
              onClick={handleAdd}
              style={{ backgroundColor: colors.green, color: '#fff', border: 'none', padding: '10px 20px', borderRadius: 8, fontWeight: 600, cursor: 'pointer', alignSelf: 'flex-end' }}
            >
              Zapisz
            </button>
          </div>
        </div>
      )}

      {materials.length === 0 ? (
        <div className={styles.emptyState} style={{ backgroundColor: colors.mantle }}>
          <p style={{ color: colors.subtext0 }}>Brak materiałów</p>
        </div>
      ) : (
        <div className={styles.materialsList}>
          {Object.entries(groupedBySubject).map(([subjectName, subjectMaterials]) => (
            <div key={subjectName} className={styles.subjectGroup} style={{ backgroundColor: colors.mantle }}>
              <h3 className={styles.subjectTitle} style={{ color: colors.blue }}>
                {subjectName}
              </h3>
              <div className={styles.materialCards}>
                {subjectMaterials.map(m => (
                  <div key={m.id} className={styles.materialCard} style={{ backgroundColor: colors.surface0 }}>
                    <div className={styles.materialIcon}>📄</div>
                    <div className={styles.materialInfo}>
                      <h4 style={{ color: colors.text, margin: '0 0 0.25rem', fontSize: '0.95rem' }}>{m.title}</h4>
                      {m.description && (
                        <p style={{ color: colors.subtext1, margin: '0 0 0.25rem', fontSize: '0.85rem' }}>{m.description}</p>
                      )}
                      <div className={styles.materialMeta}>
                        <span style={{ color: colors.subtext0, fontSize: '0.75rem' }}>
                          {m.uploaded_by_name ? `${m.uploaded_by_name} • ` : ''}
                          {new Date(m.created_at).toLocaleDateString('pl-PL')}
                        </span>
                      </div>
                    </div>
                    {isLecturer && (
                      <button
                        onClick={() => handleDelete(m.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: colors.red,
                          cursor: 'pointer',
                          fontSize: '0.8rem',
                          fontWeight: 600,
                          padding: '4px 8px',
                          alignSelf: 'flex-start',
                        }}
                      >
                        Usuń
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
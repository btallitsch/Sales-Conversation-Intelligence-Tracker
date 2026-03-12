import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/auth/LoginForm';
import { Target } from 'lucide-react';
import styles from './AuthPages.module.css';

export default function LoginPage() {
  const navigate = useNavigate();

  return (
    <div className={styles.page}>
      <div className={styles.brandPanel}>
        <div className={styles.brandContent}>
          <div className={styles.brandLogo}>
            <Target size={32} />
          </div>
          <h1 className={styles.brandTitle}>SALES<br/>INTEL</h1>
          <p className={styles.brandTagline}>
            Track objections. Refine responses.<br/>Close more deals.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Log customer objections & responses
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Surface winning patterns automatically
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Track win rates per objection type
            </div>
          </div>
        </div>
        <div className={styles.brandDecor}>
          <div className={styles.decorGrid} />
        </div>
      </div>

      <div className={styles.formPanel}>
        <LoginForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}

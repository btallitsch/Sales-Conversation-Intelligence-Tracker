import { useNavigate } from 'react-router-dom';
import RegisterForm from '../components/auth/RegisterForm';
import { Target } from 'lucide-react';
import styles from './AuthPages.module.css';

export default function RegisterPage() {
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
            Your competitive edge starts here.
          </p>
          <div className={styles.brandFeatures}>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Private — only you see your data
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Works across any sales context
            </div>
            <div className={styles.featureItem}>
              <span className={styles.featureDot} />
              Insights compound over time
            </div>
          </div>
        </div>
        <div className={styles.brandDecor}>
          <div className={styles.decorGrid} />
        </div>
      </div>

      <div className={styles.formPanel}>
        <RegisterForm onSuccess={() => navigate('/dashboard')} />
      </div>
    </div>
  );
}

import styles from './PageTitle.module.scss';

type PageTitleProps = {
    text: React.ReactNode;
    description: React.ReactNode;
};

const PageTitle = ({ text, description }: PageTitleProps) => (
    <div className={styles.PageTitle}>
        <h1 className={styles.Title}>{text}</h1>
        <span className={styles.Description}>{description}</span>
    </div>
);

export default PageTitle;

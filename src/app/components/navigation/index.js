import React from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { FaArrowLeft } from "react-icons/fa6";
import styles from './index.module.scss';

const Navigation = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const pathSegments = location.pathname.split('/').filter(Boolean);

    const currentPage = pathSegments.length === 0 ? 'Dashboard' : capitalize(pathSegments[pathSegments.length - 1]);

    function capitalize(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
    }

    function goBack() {
        navigate(-1);
    }

    // Build breadcrumb links
    const breadcrumbs = pathSegments.map((segment, index) => {
        const path = '/' + pathSegments.slice(0, index + 1).join('/');
        const label = capitalize(segment);
        return (
            <span key={path}>
                <span className={styles.separator}> / </span>
                <Link to={path} className={styles.breadcrumbLink}>{label}</Link>
            </span>
        );
    });

    return (
        <div className={styles.navigation}>
            <div className={styles.pageName}>
                <h2>{currentPage}</h2>
                <button onClick={goBack}><FaArrowLeft /> BACK</button>
            </div>
            <div className={styles.pageRoute}>
                <Link className={styles.breadcrumbLink} to="/">Dashboard</Link>
                {breadcrumbs}
            </div>
        </div>
    );
};

export default Navigation;


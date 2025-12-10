import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={styles.footer}>
      <div style={styles.container}>
        <div style={styles.content}>
          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>DreamCraft</h4>
            <p style={styles.description}>
              Where ideas venture into reality. Connect, collaborate, and monetize your innovations.
            </p>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Features</h4>
            <ul style={styles.list}>
              <li>
                <Link to="/" style={styles.link}>
                  Marketplace
                </Link>
              </li>
              <li>
                <Link to="/create-idea" style={styles.link}>
                  Create Idea
                </Link>
              </li>
              <li>
                <Link to="/collaborators" style={styles.link}>
                  Find Collaborators
                </Link>
              </li>
              <li>
                <Link to="/notifications" style={styles.link}>
                  Notifications
                </Link>
              </li>
            </ul>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Account</h4>
            <ul style={styles.list}>
              <li>
                <Link to="/profile" style={styles.link}>
                  Profile
                </Link>
              </li>
              <li>
                <Link to="/logout" style={styles.link}>
                  Logout
                </Link>
              </li>
            </ul>
          </div>

          <div style={styles.section}>
            <h4 style={styles.sectionTitle}>Legal</h4>
            <ul style={styles.list}>
              <li>
                <a href="#" style={styles.link}>
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" style={styles.link}>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#" style={styles.link}>
                  Contact Support
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div style={styles.divider} />

        <div style={styles.bottom}>
          <p style={styles.copyright}>
            © {currentYear} DreamCraft. All rights reserved.
          </p>
          <div style={styles.social}>
            <a href="#" style={styles.socialLink}>
              Twitter
            </a>
            <a href="#" style={styles.socialLink}>
              LinkedIn
            </a>
            <a href="#" style={styles.socialLink}>
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

const styles: any = {
  footer: {
    backgroundColor: '#0a0a0a',
    borderTop: '1px solid #333',
    marginTop: '60px',
    paddingTop: '40px',
    paddingBottom: '20px',
    color: '#999',
  },
  container: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '0 20px',
  },
  content: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
    gap: '40px',
    marginBottom: '30px',
  },
  section: {
    display: 'flex',
    flexDirection: 'column',
  },
  sectionTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#ddd',
    margin: '0 0 15px 0',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  description: {
    fontSize: '13px',
    lineHeight: '1.6',
    margin: '0',
    color: '#666',
  },
  list: {
    listStyle: 'none',
    padding: '0',
    margin: '0',
    display: 'flex',
    flexDirection: 'column',
    gap: '10px',
  },
  link: {
    fontSize: '13px',
    color: '#999',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
  divider: {
    height: '1px',
    backgroundColor: '#333',
    margin: '30px 0',
  },
  bottom: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: '20px',
  },
  copyright: {
    fontSize: '12px',
    color: '#666',
    margin: '0',
  },
  social: {
    display: 'flex',
    gap: '20px',
  },
  socialLink: {
    fontSize: '12px',
    color: '#999',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
};

import React from 'react';
import '../styles/loader.css';

const styles = {
  container: {
    height: 320,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  }
};

export default function Loader() {
  return (
    <div style={styles.container}>
      <div className="lds-default">
        <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
      </div>
    </div>
  );
}
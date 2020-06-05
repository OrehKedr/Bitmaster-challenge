import React from 'react';

const styles = {
  error: {
    maxWidth: 928,
    margin: '0 auto',
    padding: 14,
    boxSizing: 'border-box',
    border: '1px solid #F13636'
  }
};

const FormErrors = ({formErrors}) =>
  <div style={styles.error}>
    {Object.keys(formErrors).map((fieldName, i) => {
      if(formErrors[fieldName].length > 0){
        return (
          <p key={i}>{fieldName}: {formErrors[fieldName]}</p>
        )        
      } else {
        return '';
      }
    })}
  </div>

export default FormErrors;
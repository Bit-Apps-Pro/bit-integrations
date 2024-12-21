import React from 'react';

const SelectAuthorizationType = ({ name, options, selectedAuthType, handleChange }) => {
  return (
    <div className='user-radio-input'>
      {options.map((option, index) => (
        <label key={index} className={`btn ml-2 ${selectedAuthType === option ? 'btcd-btn-purple-active' : 'btcd-btn-o-purple'}`}>
          <input
            type="radio"
            name={name}
            value={option}
            checked={selectedAuthType === option}
            onClick={() => handleChange(option)}
            className="radio-input"
          />
          {option}{option === 'One Click Authorization' ? ' (Beta )' : ' (Recomended )'}
        </label>
      ))}
    </div>
  );
};

export default SelectAuthorizationType;

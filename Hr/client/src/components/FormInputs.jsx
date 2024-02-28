// FormInputs.js
import React from 'react';

export const TextInput = ({ label, id, name, type, value, onChange, onBlur, error }) => (
  <div className="form-group basic">
    <div className="input-wrapper">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        type={type}
        className="form-control"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  </div>
);

export const SelectInput = ({ label, id, name, value, onChange, onBlur, options, error }) => (
  <div className="form-group basic">
    <div className="input-wrapper">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <select
        className="form-control"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <div className="error-message">{error}</div>}
    </div>
  </div>
);

export const RadioInput = ({ label, id, name, value, onChange, onBlur, checked, error }) => (
  <div className="form-group basic">
    <div className="input-wrapper">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <input
        type="radio"
        className="form-control"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
        checked={checked}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  </div>
);

export const TextareaInput = ({ label, id, name, value, onChange, onBlur, error }) => (
  <div className="form-group basic">
    <div className="input-wrapper">
      <label className="label" htmlFor={id}>
        {label}
      </label>
      <textarea
        className="form-control"
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        onBlur={onBlur}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  </div>
);

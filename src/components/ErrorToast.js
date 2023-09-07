// /src/components/ErrorToast.js
import React from 'react';

const ErrorToast = ({errors}) => (
    <ul>
        {errors.map((error, index) => (
            <li key={index}>{error}</li>
        ))}
    </ul>
);

export default ErrorToast;

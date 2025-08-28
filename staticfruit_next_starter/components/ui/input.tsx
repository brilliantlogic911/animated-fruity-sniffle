import React from 'react';
export function Input(props: any){ return <input {...props} className={'px-3 py-2 rounded-xl bg-white/5 border border-white/10 text-sm ' + (props.className||'')} /> }
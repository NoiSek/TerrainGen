import Inferno from "inferno";

export const SandboxOptions = ({ options, handleOptionsInput }) => {
  let optionInputs = Object.keys(options).filter(name => name !== 'iterations').map(name =>
    <div>
      <label for={ name }>{ name }</label>
      <input type="text" name={ name } value={ options[name] } onChange={ handleOptionsInput } />
    </div>
  );

  return (
    <form className="sandbox-options">
      { optionInputs }
    </form>
  );
};
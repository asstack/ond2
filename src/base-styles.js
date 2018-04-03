import styled, { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset}
  
  * {
    box-sizing: border-box;
    
    :focus {
      outline: none;
    }
  }
  
  #root {
    min-height: 100vh;
    height: 100vh;
  }
`;

export default baseStyles;
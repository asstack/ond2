import { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset}
  
  body {
    min-height: 100vh;
    
    * {
      box-sizing: border-box;
    }
  }
  
  #root {
    height: 100vh;
  }
`;

export default baseStyles;
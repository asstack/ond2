import { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset}
  
  * {
      box-sizing: border-box;
      
      font-family: Montserrat;
      line-height: normal;
      letter-spacing: normal;
    
      :focus {
        outline: none;
      }
  }
  
  .quick-stats {
    width: 650px;
    height: 600px;
  }
  
  .remove-margins.remove-margins.remove-margins {
    margin: 0 !important;
  }
  
  #root {
    min-height: 100vh;
    height: 100vh;
  }
`;

export default baseStyles;
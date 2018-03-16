import styled, { injectGlobal } from 'styled-components';
import reset from 'styled-reset';

const baseStyles = () => injectGlobal`
  ${reset}
  
  * {
    box-sizing: border-box;
  }
  
  #root {
    min-height: 100vh;
    height: 100vh;
  }
`;

export default baseStyles;

export const AppWrapper = styled.div`
  width: 100%;
  height: 100%;
  align-items: center;
`;

export const PlayerInfoWrapper = styled.div`
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  ${(props) => props.loading ? "div { display: none; }" : ''}
`;
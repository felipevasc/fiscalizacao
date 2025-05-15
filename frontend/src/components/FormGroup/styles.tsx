import styled from 'styled-components';

export const StyledFormGroup = styled.div`
  display: flex;
  gap: 16px;
  flex-wrap: wrap;

  & > div {
    width: calc(50% - 16px);
    min-width: 250px;
  }
`;

import styled from "styled-components";

export const Container = styled.section`
  margin: 18px 0 28px;

  > h2 {
    border-bottom-width: 1px;
    border-bottom-style: solid;
    border-bottom-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};

    padding-bottom: 14px;
    margin-bottom: 18px;

    color: ${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 20px;
    font-weight: 400;
   }
`;
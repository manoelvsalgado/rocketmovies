import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: grid;
  grid-template-rows: 105px 1fr;
  grid-template-columns: 1fr;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};

  > main {
    grid-row: 2;
    grid-column: 1;
    overflow-y: auto;
    padding: 40px 80px;
  }

  .empty {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    margin-top: 24px;
    text-align: center;
    font-size: 16px;
  }
`;

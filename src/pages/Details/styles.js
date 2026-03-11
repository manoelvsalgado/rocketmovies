import styled from 'styled-components';

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
`;

export const Links = styled.ul`
  list-style: none;
  display: flex;
  flex-wrap: wrap;
  gap: 12px;

  > li {
    margin-top: 12px;

    a { 
      color: ${({ theme }) => theme.COLORS.WHITE}
    }
  }
`;

export const Content = styled.div`
  max-width: 550px;
  margin: 0 auto;

  display: flex;
  flex-direction: column;

  > button:first-child {
    align-self: end;
  }

  > h1 {
    font-size: 36px;
    font-weight: 500;
    padding-top: 64px;
  }

  > .rating {
    display: flex;
    gap: 8px;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    margin-top: 16px;
  }

  > .rating .filled {
    color: ${({ theme }) => theme.COLORS.PINK};
    fill: ${({ theme }) => theme.COLORS.PINK};
  }

  > .meta {
    display: flex;
    align-items: center;
    gap: 8px;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    margin-top: 16px;
  }

  >p {
    font-size: 16px;
    margin-top: 16px;
    text-align: justify;
  }
`;
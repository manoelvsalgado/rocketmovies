import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};

  > main {
    flex: 1;
    overflow-y: auto;
    padding: 32px 24px 40px;
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
  max-width: 980px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  padding: 28px;
  border-radius: 14px;
  background: ${({ theme }) => theme.COLORS.BACKGROUND_900};
  border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};

  > .actions {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 12px;
    margin-bottom: 18px;

    > button:first-child {
      width: fit-content;
      min-width: 140px;
      margin-top: 0;
      padding: 0 20px;
    }
  }

  > h1 {
    font-size: clamp(30px, 5vw, 38px);
    font-weight: 500;
    line-height: 1.2;
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
    margin-top: 18px;
    text-align: justify;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    line-height: 1.8;
  }

  @media (max-width: 720px) {
    padding: 20px;

    > .actions {
      flex-direction: column;
      align-items: stretch;

      > button:first-child {
        width: 100%;
      }
    }
  }
`;
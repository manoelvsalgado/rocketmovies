import styled from "styled-components";
import backgroundImg from "../../assets/background.png";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  align-items: stretch;
`;

export const Form = styled.form`
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  gap: 16px;
  min-width: 350px;

  > h1 {
    font-size: 48px;
    color: ${({ theme }) => theme.COLORS.PINK};
    margin-bottom: 16px;
  }

  > h2 {
    font-size: 24px;
    margin-top: 32px;
    margin-bottom: 24px;
  }

  > p {
    font-size: 14px;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    margin-bottom: 16px;
  }

  > a {
    margin-top: 32px;
    color: ${({ theme }) => theme.COLORS.PINK};
    font-weight: 500;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(0.9);
    }
  }
`;

export const Background = styled.div`
  flex:1;
  background: url(${backgroundImg}) no-repeat center center;
  background-size: cover;
`;
import styled from "styled-components";
import backgroundImg from "../../assets/background.png";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr minmax(360px, 520px);

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

export const Form = styled.form`
  width: 100%;
  max-width: 420px;
  margin: 0 auto;
  padding: 48px 32px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: stretch;
  text-align: left;
  gap: 16px;

  > small {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 14px;
    letter-spacing: 0.04em;
  }

  > h1 {
    font-size: clamp(36px, 6vw, 48px);
    line-height: 1;
    color: ${({ theme }) => theme.COLORS.PINK};
    margin-bottom: 8px;
  }

  > h2 {
    font-size: 24px;
    margin-top: 12px;
    margin-bottom: 8px;
  }

  > p {
    font-size: 14px;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    margin-bottom: 4px;
    line-height: 1.5;
  }

  > a {
    margin-top: 20px;
    color: ${({ theme }) => theme.COLORS.PINK};
    font-weight: 500;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(0.9);
    }
  }
`;

export const Background = styled.div`
  position: relative;
  background: url(${backgroundImg}) no-repeat center center;
  background-size: cover;

  &::before {
    content: '';
    position: absolute;
    inset: 0;
    background: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    opacity: 0.45;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;
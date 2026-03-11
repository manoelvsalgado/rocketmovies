import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};

  > header {
    width: 100%;
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 0 24px;
    background: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    border-bottom: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};

    > a {
      display: flex;
      align-items: center;
      gap: 8px;
      text-decoration: none;
      color: ${({ theme }) => theme.COLORS.GRAY_100};
      width: 100%;
      max-width: 480px;
      font-weight: 500;
    }

    svg {
      color: ${({ theme }) => theme.COLORS.GRAY_100};
      width: 20px;
      height: 20px;
      transition: filter 0.2s;

      &:hover {
        filter: brightness(1.2);
      }
    }
  }
`;

export const Form = styled.form`
  width: 100%;
  max-width: 480px;
  margin: 32px auto;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  padding: 32px;
  border-radius: 16px;
  background: ${({ theme }) => theme.COLORS.BACKGROUND_800};
  border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
  gap: 16px;

  > h2 {
    font-size: 28px;
    color: ${({ theme }) => theme.COLORS.WHITE};
  }

  > p {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 14px;
    margin-bottom: 8px;
  }

  @media (max-width: 560px) {
    margin: 20px 16px;
    padding: 24px;
  }
`;

export const Avatar = styled.div`
  position: relative;
  width: 152px;
  height: 152px;
  margin: 0 auto 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  > img {
    border-radius: 50%;
    width: 100%;
    height: 100%;
    object-fit: cover;
    border: 4px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
  }

  > label {
    width: 44px;
    height: 44px;
    background-color: ${({ theme }) => theme.COLORS.ORANGE};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    bottom: 0;
    right: 0;
    cursor: pointer;
    transition: filter 0.2s;

    &:hover {
      filter: brightness(0.9);
    }

    input {
      display: none;
    }

    svg {
      width: 20px;
      height: 20px;
      color: ${({ theme }) => theme.COLORS.BACKGROUND_800};
    }
  }
`;
import styled from "styled-components";

export const Container = styled.div`
  width: 100%;
  height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};

  > header {
    width: 100%;
    height: 56px;
    display: flex;
    align-items: center;
    padding: 0 80px;
    background: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    border-bottom: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};

    > a {
      display: flex;
      align-items: center;
      text-decoration: none;
    }

    svg {
      color: ${({ theme }) => theme.COLORS.GRAY_100};
      width: 24px;
      height: 24px;
      transition: filter 0.2s;

      &:hover {
        filter: brightness(1.2);
      }
    }
  }
`;

export const Form = styled.form`
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 48px;
  gap: 16px;
  max-width: 400px;
  margin: 0 auto;
  width: 100%;
`;

export const Avatar = styled.div`
  position: relative;
  width: 186px;
  height: 186px;
  margin-bottom: 32px;
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
    width: 48px;
    height: 48px;
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
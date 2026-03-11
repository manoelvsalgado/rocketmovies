import styled from 'styled-components';

export const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

export const Modal = styled.div`
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};
  border-radius: 10px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
  width: 100%;
  max-width: 500px;
  display: flex;
  flex-direction: column;
  max-height: 90vh;
  overflow-y: auto;
`;

export const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px;
  border-bottom: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};

  h2 {
    font-size: 20px;
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-weight: 600;
  }

  .close-btn {
    background: none;
    border: none;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    cursor: pointer;
    font-size: 24px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;

    &:hover {
      color: ${({ theme }) => theme.COLORS.WHITE};
    }
  }
`;

export const Content = styled.div`
  padding: 24px;
  flex: 1;

  form {
    display: flex;
    flex-direction: column;
    gap: 16px;

    .role-select {
      display: flex;
      flex-direction: column;
      gap: 8px;

      label {
        color: ${({ theme }) => theme.COLORS.GRAY_100};
        font-size: 14px;
        font-weight: 500;
      }

      select {
        padding: 12px 16px;
        background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
        color: ${({ theme }) => theme.COLORS.WHITE};
        border: none;
        border-radius: 10px;
        font-size: 14px;
        cursor: pointer;

        option {
          background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
          color: ${({ theme }) => theme.COLORS.WHITE};
        }

        &:focus {
          outline: 2px solid ${({ theme }) => theme.COLORS.PINK};
        }
      }
    }
  }
`;

export const Footer = styled.div`
  display: flex;
  gap: 12px;
  padding: 24px;
  border-top: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
  margin-top: 16px;

  .cancel-btn {
    flex: 1;
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};
    color: ${({ theme }) => theme.COLORS.WHITE};
    height: 56px;
    border: none;
    border-radius: 10px;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover {
      background-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};
      filter: brightness(1.2);
    }
  }

  button:last-child {
    flex: 1;
  }
`;

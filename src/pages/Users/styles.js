import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  min-height: 100vh;

  display: grid;
  grid-template-rows: 105px 1fr;

  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};
`;

export const Content = styled.main`
  grid-area: content;
  overflow-y: auto;
  padding: 32px 24px 40px;

  max-width: 1080px;
  width: 100%;
  margin: 0 auto;

  .blocked {
    border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
    background: ${({ theme }) => theme.COLORS.BACKGROUND_900};
    border-radius: 14px;
    padding: 32px 24px;
    text-align: center;

    h1 {
      font-size: 30px;
      margin-bottom: 10px;
    }

    p {
      color: ${({ theme }) => theme.COLORS.GRAY_100};
    }
  }

  > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    h1 {
      font-size: clamp(30px, 4vw, 38px);
      color: ${({ theme }) => theme.COLORS.WHITE};
    }

    p {
      margin-top: 6px;
      color: ${({ theme }) => theme.COLORS.GRAY_100};
      font-size: 14px;
    }

    button {
      height: 56px;
      width: auto;
      padding: 0 24px;
      margin-top: 0;
    }
  }

  @media (max-width: 720px) {
    padding: 24px 16px 32px;

    > .header {
      flex-direction: column;
      align-items: stretch;
      gap: 12px;

      button {
        width: 100%;
      }
    }
  }
`;

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};
  border-radius: 12px;
  overflow: auto;
  border: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_900};
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;

  thead {
    background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};

    th {
      padding: 16px;
      text-align: left;
      font-weight: 600;
      color: ${({ theme }) => theme.COLORS.GRAY_100};
      font-size: 14px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      border-bottom: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
    }
  }

  tbody {
    tr {
      border-bottom: 1px solid ${({ theme }) => theme.COLORS.BACKGROUND_700};
      transition: background-color 0.2s;

      &:hover {
        background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};
      }

      &:last-child {
        border-bottom: none;
      }

      td {
        padding: 16px;
        color: ${({ theme }) => theme.COLORS.WHITE};
        font-size: 14px;

        .user-cell {
          display: flex;
          align-items: center;
          gap: 12px;

          img {
            width: 40px;
            height: 40px;
            border-radius: 50%;
            object-fit: cover;
          }

          span {
            font-weight: 500;
          }
        }

        .role {
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: 600;
          text-transform: uppercase;
          width: fit-content;

          &.admin {
            background-color: ${({ theme }) => theme.COLORS.PINK};
            color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
          }

          &.user {
            background-color: ${({ theme }) => theme.COLORS.GRAY_300};
            color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
          }
        }

        .actions {
          display: flex;
          gap: 12px;

          button {
            background: none;
            border: none;
            cursor: pointer;
            padding: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 4px;
            transition: all 0.2s;

            svg {
              width: 18px;
              height: 18px;
            }

            &.edit-btn {
              color: ${({ theme }) => theme.COLORS.PINK};

              &:hover {
                background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
              }
            }

            &.delete-btn {
              color: ${({ theme }) => theme.COLORS.RED};

              &:hover {
                background-color: ${({ theme }) => theme.COLORS.BACKGROUND_900};
              }
            }
          }
        }
      }
    }
  }

  @media (max-width: 840px) {
    min-width: 720px;
  }
`;

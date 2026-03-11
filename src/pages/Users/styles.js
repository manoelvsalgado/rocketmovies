import styled from 'styled-components';

export const Container = styled.div`
  width: 100%;
  height: 100vh;

  display: grid;
  grid-template-rows: 105px auto;

  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};
`;

export const Content = styled.main`
  grid-area: content;
  overflow-y: auto;
  padding: 40px 80px;

  > .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 32px;

    h1 {
      font-size: 32px;
      color: ${({ theme }) => theme.COLORS.WHITE};
    }

    button {
      height: 56px;
      width: auto;
      padding: 0 24px;
    }
  }
`;

export const TableContainer = styled.div`
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
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
                background-color: rgba(255, 133, 155, 0.1);
              }
            }

            &.delete-btn {
              color: ${({ theme }) => theme.COLORS.RED};

              &:hover {
                background-color: rgba(255, 0, 46, 0.1);
              }
            }
          }
        }
      }
    }
  }
`;

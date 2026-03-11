import styled from "styled-components";

export const Container = styled.button`
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};

  border: 1px solid transparent;
  border-radius: 12px;

  padding: 22px;
  margin-bottom: 16px;
  transition: border-color 0.2s, transform 0.2s;

  &:hover {
    border-color: ${({ theme }) => theme.COLORS.PINK};
    transform: translateY(-2px);
  }

  > h1 {
    flex: 1;
    text-align: left;
    font-weight: 700;
    font-size: clamp(20px, 4vw, 24px);
    color: ${({ theme }) => theme.COLORS.WHITE};
  }

  > .rating {
    display: flex;
    gap: 6px;
    margin: 12px 0 16px;
    color: ${({ theme }) => theme.COLORS.GRAY_100};
  }

  > .rating .filled {
    color: ${({ theme }) => theme.COLORS.PINK};
    fill: ${({ theme }) => theme.COLORS.PINK};
  }

  > p {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    text-align: left;
    line-height: 1.7;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  footer {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    margin-top: 24px;
  }
`;
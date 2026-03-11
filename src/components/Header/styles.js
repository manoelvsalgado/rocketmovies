import styled from "styled-components";
import { Link } from 'react-router-dom';

export const Container = styled.header`
  grid-area: header;
  position: sticky;
  top: 0;
  z-index: 100;

  height: 105px;
  width: 100%;
  background-color: ${({ theme }) => theme.COLORS.BACKGROUND_800};

  border-bottom-width: 1px;
  border-bottom-style: solid;
  border-bottom-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};

  display: flex;
  align-items: center;
  gap: 24px;

  padding: 0 24px;

  > .logo {
    text-decoration: none;
    flex-shrink: 0;

    h1 {
      color: ${({ theme }) => theme.COLORS.PINK};
      font-family: 'Roboto Slab';
      font-weight: 700;
      font-size: 22px;
      transition: filter 0.2s;
    }

    &:hover h1 {
      filter: brightness(1.15);
    }
  }

  > .search {
    flex: 1;
    max-width: 720px;
  }

  > .spacer {
    flex: 1;
  }

  .admin-btn {
    background: none;
    border: none;
    color: ${({ theme }) => theme.COLORS.PINK};
    cursor: pointer;
    font-size: 24px;
    padding: 8px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 8px;
    transition: all 0.2s;

    svg {
      width: 24px;
      height: 24px;
    }

    &:hover {
      background-color: ${({ theme }) => theme.COLORS.BACKGROUND_700};
    }
  }

  @media (max-width: 980px) {
    gap: 12px;

    .logo {
      display: none;
    }
  }

  @media (max-width: 720px) {
    height: 96px;
    padding: 0 16px;
    gap: 10px;

    .admin-btn {
      padding: 6px;
    }

    > .search {
      max-width: none;
      min-width: 0;
    }
  }
`;

export const Profile = styled(Link)`
display: flex;
align-items: center;

 > img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
 }

 > div {
  width: 180px;
  height: 64px;
  display: flex;
  flex-direction: column;
  margin-left: 16px;
  line-height: 22px;

  strong {
    color: ${({ theme }) => theme.COLORS.WHITE};
    font-family: 'Roboto Slab';
    font-weight: 700;
    font-size: 14px;
  }

  span {
    color: ${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 14px;
  }
 }

 @media (max-width: 980px) {
  > div {
    display: none;
  }

  > img {
    width: 52px;
    height: 52px;
  }
 }
`;

export const Logout = styled.button`
  border: none;
  background: none;
  display: flex;
  align-items: center;
  justify-content: center;

  svg {
    color:${({ theme }) => theme.COLORS.GRAY_100};
    font-size: 24px;
  }
`;
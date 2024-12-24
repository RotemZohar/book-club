import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setShowNavbar } from "../redux/slices/navbarSlice";

export const useHideNavbar = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(setShowNavbar(false));

    return () => {
      dispatch(setShowNavbar(true));
    };
  }, []);
};

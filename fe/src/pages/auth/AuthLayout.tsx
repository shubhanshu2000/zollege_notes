import { Outlet } from "react-router";
import authImage from "../../assets/auth.jpg";

const AuthLayout = () => {
  return (
    <>
      <div>
        <div className="h-screen flex">
          <div className="w-[60%] h-full relative">
            <h1 className="text-metaBlue fixed top-6 left-8 font-bold text-xl font-redhat">
              Notes App
            </h1>
            <div className="w-full h-full flex items-center justify-center">
              <Outlet />
            </div>
          </div>
          <div className="w-[40%] h-screen relative overflow-hidden">
            <img
              src={authImage}
              alt="Auth Image"
              className="object-cover object-center"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default AuthLayout;

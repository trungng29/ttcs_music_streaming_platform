import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

// Mô tả chức năng của component AuthProvider:
// Khi app khởi động, tự động lấy token, gắn vào axios, 
// trong lúc chờ thì show loading, xong thì render app.

// Khi có token thì nó thêm token vào headers mặc định của axiosInstance
// Nếu ko có token thì xóa luôn Authorization
const updateApiToken = (token: string | null) => {
  if (token) {
    axiosInstance.defaults.headers.common["Authorization"] = `Bearer ${token}`;
  } else {
    delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// children là tất cả những component nằm bên trong AuthProvider
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { getToken } = useAuth();
  const [loading, setLoading] = useState(true);
  const { checkAdminStatus } = useAuthStore();

  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = await getToken(); // gọi API lấy token
        updateApiToken(token); // cập nhật token vào axios

        if (token) {
          await checkAdminStatus(); // kiểm tra xem có phải admin ko
        }
      } catch (error: any) {
        updateApiToken(null); // lỗi thì xóa token
        console.log("Error in auth provider", error);
      } finally {
        setLoading(false); // hết loading
      }
    };

    initAuth();
  }, [getToken]);

  if (loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center">
        <Loader className="size-8 text-emerald-500 animate-spin" />
      </div>
    );
  }
  return <div>{children}</div>;
};

export default AuthProvider;

import { useAuthContext } from "@/pages/login/context";
import { LogoutOutlined } from "@ant-design/icons";
import { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import type { MenuProps } from "antd";
import { Button, Dropdown } from "antd";

export default function SubHeader() {
  const navigate = useNavigate();
  const [selectedLink, setSelectedLink] = useState<string>("pedidos");
  const { logout } = useAuthContext();
  // const user = JSON.parse(localStorage.getItem("vivoGold@user") || "null");
  // const userID = user?.id;

  const handleLogOut = useCallback(async () => {
    try {
      await logout();
    } finally {
      navigate("/admin");
    }
  }, [logout, navigate]);
  const toolsMenuItems: MenuProps["items"] = [
    {
      key: "check-operadora",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("check-operadora");
            navigate(`/admin/check-operadora`);
          }}
        >
          Check Operadora
        </span>
      ),
    },
    {
      key: "check-anatel",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("check-anatel");
            navigate(`/admin/check-anatel`);
          }}
        >
          Check Anatel
        </span>
      ),
    },
    {
      key: "zap-checker",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("zap-checker");
            navigate(`/admin/zap-checker`);
          }}
        >
          Zap Checker
        </span>
      ),
    },
    {
      key: "pj-checker",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("pj-checker");
            navigate(`/admin/pj-checker`);
          }}
        >
          Phone Finder
        </span>
      ),
    },
    {
      key: "base2b-socio",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("base2b-socio");
            navigate(`/admin/base2b-socio`);
          }}
        >
          Base2B / Busca-sócio
        </span>
      ),
    },
    {
      key: "base2b-empresa",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("base2b-empresa");
            navigate(`/admin/base2b-empresa`);
          }}
        >
          Base2B / Busca-empresa
        </span>
      ),
    },
    {
      key: "gender-checker",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("gender-checker");
            navigate(`/admin/gender-checker`);
          }}
        >
          Gender Checker
        </span>
      ),
    },
    {
      key: "pf-ou-pj",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("pf-ou-pj");
            navigate(`/admin/pf-ou-pj`);
          }}
        >
          PF ou PJ?
        </span>
      ),
    },
    {
      key: "mail-checker",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("mail-checker");
            navigate(`/admin/mail-checker`);
          }}
        >
          MailChecker
        </span>
      ),
    }
  ];

  const lpMenuItems: MenuProps["items"] = [

  ];

  // const managementMenuItems: MenuProps["items"] = [
  //   {
  //     key: "usuarios",
  //     label: (
  //       <span
  //         onClick={() => {
  //           setSelectedLink("usuarios");
  //           navigate("/admin/usuarios");
  //         }}
  //       >
  //         Usuários
  //       </span>
  //     ),
  //   },
  //   // {
  //   //   key: "representantes",
  //   //   label: (
  //   //     <span
  //   //       onClick={() => {
  //   //         setSelectedLink("representantes");
  //   //         navigate("/admin/representantes");
  //   //       }}
  //   //     >
  //   //       Representantes
  //   //     </span>
  //   //   ),
  //   // },
  // ];



  const ordersMenuItems: MenuProps["items"] = [
    {
      key: "pedidos",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("pedidos");
            navigate(`/admin/pedidos`);
          }}
        >
          Pedidos
        </span>
      ),
    },


  ];


  const chatsMenuItems: MenuProps["items"] = [
    {
      key: "chats",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("chats");
            navigate(`/admin/chats`);
          }}
        >
          Chat
        </span>
      ),
    },
    {
      key: "evolution",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("evolution");
            navigate(`/admin/evolution`);
          }}
        >
          Conectar Conta
        </span>
      ),
    },
  ];

  const clientsMenuItems: MenuProps["items"] = [
    {
      key: "clientes-pj",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("clientes-pj");
            navigate(`/admin/clientes-pj`);
          }}
        >
          PJ
        </span>
      ),
    },
    {
      key: "clientes-pf",
      label: (
        <span className="text-[#242424]"
          onClick={() => {
            setSelectedLink("clientes-pf");
            navigate(`/admin/clientes-pf`);
          }}
        >
          PF
        </span>
      ),
    },
  ];


  return (
    <div className="relative z-2">
      <div className="">
        <div className="flex  justify-between items-center p-2 bg-[#d4d4d4] px-6 md:px-10 lg:px-14">
          <div className="flex items-center gap-8">
            <Dropdown menu={{ items: ordersMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-[#242424] hover:text-[#4d4d4d] ${selectedLink === "pedidos"
                  ? "font-bold text-[#2a4bdf]"
                  : ""
                  }`}
              >
                Pedidos
              </a>
            </Dropdown>

            <Dropdown menu={{ items: clientsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-[#242424] hover:text-[#4d4d4d] ${selectedLink === "clientes-pj"
                  ? "font-bold text-[#2a4bdf]"
                  : ""
                  }`}
              >
                Clientes
              </a>
            </Dropdown>
            {/* 
            <Dropdown menu={{ items: prospectsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "prospects-pj"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Prospects
              </a>
            </Dropdown> */}

            <a
              onClick={() => {
                setSelectedLink("contatos");
                navigate(`/admin/contatos`);
              }}
              className={`text-[14px] cursor-pointer text-[#242424] hover:text-[#4d4d4d] ${selectedLink === "contatos" ? "font-bold text-[#2a4bdf]" : ""
                }`}
            >
              Mensagens
            </a>

            <Dropdown menu={{ items: chatsMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-[#242424] hover:text-[#4d4d4d]">
                Chatter
              </a>
            </Dropdown>



            <Dropdown menu={{ items: lpMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-[#242424] hover:text-[#4d4d4d]">
                LPs
              </a>
            </Dropdown>

            <Dropdown menu={{ items: toolsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-[#242424] hover:text-[#4d4d4d] ${selectedLink === "pj-checker" ||
                  selectedLink === "check-anatel" ||
                  selectedLink === "zap-checker" ||
                  selectedLink === "base2b-empresa" ||
                  selectedLink === "base2b-socio" ||
                  selectedLink === "check-operadora"
                  ? "font-bold text-[#2a4bdf]"
                  : ""
                  }`}
              >
                Tools
              </a>
            </Dropdown>

            {/* <Dropdown menu={{ items: prospectsMenuItems }} placement="bottom">
              <a
                onClick={(e) => e.preventDefault()}
                className={`text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100 ${
                  selectedLink === "prospects-pj"
                    ? "font-bold text-neutral-100"
                    : ""
                }`}
              >
                Prospects
              </a>
            </Dropdown> */}

            {/* <Dropdown menu={{ items: managementMenuItems }} placement="bottom">
              <a className="text-[14px] cursor-pointer text-neutral-300 hover:text-neutral-100">
                Gestão
              </a>
            </Dropdown> */}
          </div>

          <div className="flex items-center gap-4">
            {/* <Button
              type="link"
              onClick={() => navigate(`/admin/perfil-usuario/${userID}`)}
              style={{ padding: 0 }}
              className="logout-btn "
            >
              <UserOutlined style={{ color: "#e4e0e0" }} />
            </Button> */}
            <Button
              type="link"
              onClick={() => {
                void handleLogOut();
              }}
              style={{ padding: 0 }}
              className="logout-btn "
            >
              <LogoutOutlined style={{ color: "#242424" }} />
            </Button>
            <style>
              {`
              .subheader-dropdown .ant-dropdown-menu-title-content > a {
                color: #242424 !important;
              }

              .subheader-dropdown .ant-dropdown-menu-title-content > a:hover {
                color: #242424 !important;
              }

              .logout-btn:hover .anticon {
                color: #242424 !important;
                font-size: 17px;
              }
            
              `}
            </style>
          </div>
        </div>
      </div>
    </div>
  );
}

module.exports = {
  variants: {
    borderColor: ["group-hover"],
    textColor: ["responsive", "hover", "focus", "group-hover"],
  },
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      mobile: "390px",
      tablet: "744px",
      desktop: "1280px",
    },
    container: {
      center: true,
      padding: "0.938rem",
      screens: {
        desktop: "1864px",
      },
    },
    extend: {
      fontSize: {
        "23px": ["1.438rem"],
        "40px": ["2.5rem"],
      },
      colors: {
        primary: "#0B1D31",
        warning: "#E08400",
        success: "#007512",
        accent: "#c8a656",
        gray: "#CACED280",
        offwhite: "#F8F6EB",
      },
      fontFamily: {
        // roboto: ['"Roboto"', '"sans-serif"'],
        inter: ['"Effra"'],
      },
      borderRadius: {
        "15px": "0.938rem",
        "17px": "1.063rem",
        "18px": "1.125rem",
        "22px": "1.375rem",
        "31px": "1.938rem",
        "41px": "2.563rem",
        "45px": "2.813rem",
        "30px": "1.875rem",
      },
    },

    backgroundImage: {
      "primary-background": "url('/src/assets/background-image.png')",
    },
  },

  plugins: [],
};

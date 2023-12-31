import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";

i18n
  // detect user language
  // learn more: https://github.com/i18next/i18next-browser-languageDetector
  .use(LanguageDetector)
  // pass the i18n instance to react-i18next.
  .use(initReactI18next)
  // init i18next
  // for all options read: https://www.i18next.com/overview/configuration-options
  .init({
    debug: true,
    fallbackLng: "ar",
    lng: "ar",
    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: {
          g: {
            unknown: "unknown",
            loading_platform: "loading platform",
            error_page: "this page doesn't exist, redirecting...",
          },
          login: {
            header: "Sign in to your account",
            headerReset: "Reset your password",
            usernamePlaceholder: "Username",
            passwordPlaceholder: "Password",
            passwordConfirmPlaceholder: "Password Confirm",
            button: "Sign in",
            buttonReset: "Continue",
            error: {
              username_required: "Email is required",
              password_required: "Password is required",
              password_confirm_required: "Password confirm is required",
              password_mismatch: "Passwords do not match",
              new_totp: "TOTP code expired, you should receive a new one",
              wrong_totp: "Wrong TOTP code, please try again",
              same_totp: "TOTP repeated, please change it!",
            },
          },
          sidebar: {
            evaluations: "Evaluations",
            signout: "Sign out (Judge)",
            prizes: "Prizes",
          },
          evaluation: {
            signout: "Sign Out",
            header: "Waiting Evaluation",
            subheader: "Evaluation Criteria",
            paragraph: "Choose an award to evaluate participants",
          },
          evaluationList: {
            filterer: "filtering",
            judge: "judgement",
            prioritizer: "Prioritizing",
            total: "Total Candidates",
            source: "Source",
            applicationInfo: {
              workoverview: "Work Overview",
              projectYear: "Project Year",
              trackName: "Track Name",
              participationTitle: "Participation Title",
            },
            evaluated: "Evaluated",
            unevaluated: "Waiting Evaluation ",
            nocandidates: "No Candidates",
            evaluateButton: "Evaluate",
            updateButton: "Update",
            rated: "Rated",
            unrated: "Pending",
            update: "Update",
            rate: "Evaluate",
            ID: "ID",
            projectName: "Applicant Name",
            state: "Evaluation Status",
            score: "Score",
            date: "Date",
            change: "Change",
            workDocumentationNumber: "Work DocumentationNumber",
            dateOfApplicant: "Date of applicant won in the same track",
            numberOfInternational: "Number of international Participations",
            internationalParticipations: "International Participations",
            community: "Community And Volunteer Contributions",
            workDate: "Work Date",
            productionDate: "Production Date",
            numberOfSales: "Number of sales (copy)",
            numberOfTranslationLanguages: "Number of translation Languages",
            translationLanguages: "Translation Languages",
            localAndInternational: "Local And International literary Influence",
            workLanguage: "Work Language",
          },
          prioList: {
            order_hint: {
              high: "grade from highest",
              low: "to lowest",
              no_qs: "No measurement criteria",
            },
            filterer: "prio filtering",
            judge: "prio judgement",
            prioritizer: "Prioritizing",
            rated: "Evaluated Candidates",
            unrated: "Unevaluated Candidates",
            total: "Total Candidates",
            num_of_apps: "applications",
            applicationInfo: {
              workoverview: "Work Overview",
              projectYear: "Project Year",
              trackName: "Track Name",
              participationTitle: "Participation Title",
            },
            evaluated: "Evaluated",
            unevaluated: "Waiting Evaluation ",
            nocandidates: "No Candidates",
            evaluateButton: "Evaluate",
            updateButton: "Update",
            update: "Update",
            rate: "Rate",
            ID: "Application ID",
            projectName: "Project Name",
            state: "State",
            score: "measurment",
            date: "Date",
            change: "action",
            order: "order",
            unordered: "unordered",
          },
          dialogInfo: {
            comment: "comment",
            merged: "merged",
            profile: "Profile",
            socialImpact: "Social Impact",
            inspirationalStory: "Inspirational Story",
            socialmedia: "Social Media Links",
            email: "Email",
            age: "Age",
            contactnumber: "Contact Number",
            gender: "Gender",
            country: "Country",
            city: "City",
            cv: "CV",
            participationTitle: "Participation Title",
            participationFile: "Participation File",
            participationFileMovie: "Theatrical Act",
            summary: "Summary",
            brief: "brief",
            inspiration_story: "inspiration story",
            productionYear: "Production Year",
            publishingState: "Publishing State",
            previousWorkLink: "Previous Work",
            cvLink: "CV Link",
            snapchat: "Snapchat",
            instagram: "Instagram",
            twitter: "Twitter",
            linkedIn: "LinkedIn",
            youtube: "Youtube",
            additionalFiles: "website",
            publishing_house_license: "publishing house license",
            cr: "commercial registration",
            trade_mark: "trade mark",
            company_profile: "company profile",
            comapny_license: "company license",
            practitioner_certificate: "practitioner certificate",
            hasTheCandidateWonAwards: "Have the candidate won awards?",
            numberOfLocalParticipations: "number of local participations",
            localParticipations: "local participations",
            havePersonalWorksInCinemas:
              "Have personal works been shown in cinemas outside the Kingdom?",
            haveBeenShownInFestivals:
              "Have personal works been participated in regional or international festivals?",
            activityAndInfluence:
              "The activity and influence of the candidate on local programs and activities",
            ticketsSold: "tickets sold",
            whatKindOfSupport:
              "What kind of support is provided by private and non-profit organizations?",
            totalSupportReceived: "Total support received",
          },
          stats: {
            title: "Statistics",
            filtering: "filtering",
            judging: "judging",
            auto_update: "auto updating in ",
            user: "user",
            total: "total",
            done: "done",
            percent: "percentage",
            half_done: "half done",
            less_than_half_done: "less than half done",
            not_started: "not started",
          },
        },
      },
      ar: {
        translation: {
          g: {
            unknown: "غير معروف",
            loading_platform: "...جاري تحميل المنصة",
            error_page: "هذه الصفحة غير موجودة ، جاري إعادة التوجيه ...",
          },
          login: {
            header: "قم بتسجيل الدخول إلى حسابك",
            headerReset: "غير كلمة السر",
            usernamePlaceholder: "اسم المستخدم",
            passwordPlaceholder: "كلمة السر",
            passwordConfirmPlaceholder: "تاكيد كلمة السر",
            button: "تسجيل الدخول",
            buttonReset: "أكمل الدخول",
            error: {
              username_required: "الايميل مطلوب",
              password_required: "كلمة السر مطلوبة",
              password_confirm_required: "تاكيد كلمة السر مطلوبة",
              password_mismatch: "كلمة السر غير متطابقة",
              new_totp: "لقد انتهت صلاحية الرمز و قد تم ارسال رمز جديد",
              wrong_totp: "الرمز غير صحيح",
              same_totp: "الرمز متكرر, الرجاء تغيره",
            },
          },
          sidebar: {
            rating: "التقييم",
            signout: "تسجيل الدخول (الحكم)",
            prizes: "الجوائز",
          },
          evaluation: {
            signout: "تسجيل الخروج",
            header: "منتظر التقييم",
            paragraph: "اختار جائزة لتقييم المشتركين",
          },
          evaluationList: {
            filterer: "التصفية",
            judge: "التحكيم",
            prioritizer: "المفاضلة",
            subheader: "معايير التقييم",
            total: "المجموع",
            source: "المصدر",
            applicationInfo: {
              workoverview: "نبذة عامة عن العمل:",
              projectYear: "سنة المشروع:",
              trackName: "اسم المسار:",
              participationTitle: "عنوان المشاركة:",
            },
            evaluated: "تم التقييم",
            unevaluated: "بانتظار التقييم",
            nocandidates: "لا يوجد اي مشتركين متبقيين",
            evaluateButton: "إجراء التقييم",
            updateButton: "إجراء التحديث",
            rated: "تم التقييم",
            unrated: "لم يتم التقييم",
            update: "تحديث",
            rate: "تقييم",
            ID: "رقم المشاركة",
            projectName: "اسم المشارك",
            state: "حالة التقييم",
            score: "الدرجة",
            date: "التاريخ",
            change: "التعديل",
            workDocumentationNumber: "رقم توثيق العمل",
            dateOfApplicant: "تاريخ فوز المرشح في ذات المسار",
            numberOfInternational: "عدد مشاركات المرشح الدولية",
            internationalParticipations: "المشاركات الدولية",
            community: "مشاركات المرشح المجتمعية و التطوعية",
            workDate: "سنة العمل",
            productionDate: "سنة الإنتاج",
            numberOfSales: "عدد المبيعات (نسخة)",
            numberOfTranslationLanguages: "عدد اللغات التي تمت الترجمة إليها",
            translationLanguages: "اللغات التي ترجم إليها",
            localAndInternational:
              "نشاط و تأثير المرشح في الساحة الأدبية المحلية و الدولية",
            workLanguage: "لغة العمل",
          },
          prioList: {
            order_hint: {
              high: "قييم من الأعلى",
              low: "الى الأقل",
              no_qs: "لا توجد معايير قياس",
            },
            filterer: "مفاضلة التصفية",
            judge: "مفاضلة التحكيم",
            prioritizer: "المفاضلة",
            subheader: "معايير التقييم",
            total: "المجموع",
            num_of_apps: "عدد المشاركين",
            applicationInfo: {
              workoverview: "نبذة عامة عن العمل:",
              projectYear: "سنة المشروع:",
              trackName: "اسم المسار:",
              participationTitle: "عنوان المشاركة:",
            },
            evaluated: "تم التقييم",
            unevaluated: "بانتظار التقييم",
            nocandidates: "لا يوجد اي مشتركين",
            evaluateButton: "إجراء التقييم",
            updateButton: "إجراء التحديث",
            rated: "تم التقييم",
            unrated: "لم يتم التقييم",
            update: "تحديث",
            rate: "تقييم",
            ID: "رقم المجموعة",
            state: "الحالة",
            score: "المقياس",
            date: "التاريخ",
            change: "المفاضلة",
            order: "الترتيب",
            unordered: "غير مرتب",
          },
          dialogInfo: {
            comment: "اضف تعليق",
            merged: "مدمج",
            profile: "الملف الشخصي",
            socialImpact: "الأثر الاجتماعي",
            inspirationalStory: "القصة الإلهامية",
            socialmedia: "روابط قنوات التواصل الاجتماعي",
            email: "البريد الالكتروني",
            age: "العمر",
            contactnumber: "رقم التواصل",
            gender: "الجنس",
            country: "الدولة",
            city: "المدينة",
            cv: "السيرة الذاتية",
            participationTitle: "عنوان المشاركة",
            participationFile: "ملف المشاركة",
            participationFileMovie: "العمل المسرحي",
            summary: "ملخص",
            brief: "نبذة شخصية",
            inspiration_story: "القصة الملهمة",
            productionYear: "سنة الانتاج",
            publishingState: "حالة النشر",
            previousWorkLink: "رابطة الاعمال السابقة",
            cvLink: "السيرة الذاتية",
            snapchat: "سناب شات",
            instagram: "انستغرام",
            twitter: "تويتر",
            linkedIn: "لنكيد ان",
            youtube: "يوتيوب",
            additionalFiles: "الموقع الاإلكتروني",
            publishing_house_license: "رخصة دار النشر",
            cr: "التسجيل التجاري",
            trade_mark: "العلامة التجارية",
            company_profile: "ملف الشركة",
            practitioner_certificate: "شهادة ممارس",
            comapny_license: "رخصة الشركة",
            hasTheCandidateWonAwards: "هل سبق الحصول على جوائز",
            numberOfLocalParticipations: "عدد مشاركات المرشح المحلية",
            localParticipations: "المشاركات المحلية",
            havePersonalWorksInCinemas:
              "هل تم عرض الأعمال الشخصية في صالات السينما خارج المملكة؟",
            haveBeenShownInFestivals:
              "هل تم مشاركة الأعمال الشخصية في مهرجانات إقليمية أو دولية؟",
            activityAndInfluence:
              "نشاط وتأثير المرشح في البرامج والأنشطة المحلية",
            ticketsSold: "عدد التذاكر المباعة",
            whatKindOfSupport:
              "ما نوع الدعم المقدم من الجهات الخاصة والجهات غير الربحية؟",
            totalSupportReceived: "أجمالي الدعم المتلقى",
          },
          stats: {
            title: "الإحصائيات",
            filtering: "التصفية",
            judging: "التحكيم",
            auto_update: "سيتم التحديث بعد ",
            user: "المستخدم",
            total: "المجموع",
            done: "مكتمل",
            half_done: "نصف مكتمل",
            less_than_half_done: "اقل من نصف مكتمل",
            percent: "النسبة",
            not_started: "لم يبدأ",
          },
        },
      },
    },
  });

export default i18n;

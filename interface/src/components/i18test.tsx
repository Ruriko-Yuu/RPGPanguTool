import * as React from "react";
import { memo } from "react";
import { Component } from "react";
import { useTranslation } from "react-i18next";
import { withTranslation, WithTranslation } from "react-i18next";
import i18n from "../../i18n";
export const FunComponentExample = memo(() => {
  const { t } = useTranslation();
  return (
    <button
      onClick={() => {
        i18n.changeLanguage("ch");
      }}
    >
      {t("中文")}
    </button>
  );
});

class ClassComponent extends Component<WithTranslation, any> {
  render() {
    const { t } = this.props;
    return (
      <button
        onClick={() => {
          i18n.changeLanguage("en");
        }}
      >
        {t("英文")}
      </button>
    );
  }
}

export const ClassComponentExample = withTranslation()(ClassComponent);
export const I18Example = memo(() => {
  return (
    <div>
      <div
        onClick={() => {
          i18n.changeLanguage("ch");
        }}
      >
        <FunComponentExample />
      </div>
      <div>
        <ClassComponentExample />
      </div>
    </div>
  );
});

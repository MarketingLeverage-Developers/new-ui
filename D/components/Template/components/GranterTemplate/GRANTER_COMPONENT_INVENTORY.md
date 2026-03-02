# Granter UI Component Inventory

Source baseline: `tmp_granter_extracted/*`

## Implemented Pure Components

| Reference source | Local pure component |
| --- | --- |
| `_components_button_back_index.tsx` | `../../../Button/components/GranterBackButton/GranterBackButton.tsx` |
| `_components_button_default_index.tsx` | `../../../Button/components/GranterActionButton/GranterActionButton.tsx` |
| `_components_button_nav_index.tsx` | `../../../Button/components/GranterNavButton/GranterNavButton.tsx` |
| `_components_date_simpleDateRange_index.tsx` | `components/GranterSimpleDateRange/GranterSimpleDateRange.tsx` |
| `_components_date_swaper_index.tsx` | `components/GranterDateSwaper/GranterDateSwaper.tsx` |
| `_components_date_swaperWithPanel_index.tsx` | `components/GranterDateSwaperWithPanel/GranterDateSwaperWithPanel.tsx` |
| `_components_header_support_index.tsx` | `../../../Dropdown/components/GranterSupportMenu/GranterSupportMenu.tsx` |
| `_components_sidebar_navigation_workspaceInfo.tsx` | `components/GranterWorkspaceInfo/GranterWorkspaceInfo.tsx` |
| `_components_sidebar_navigation_hiddenMenuList.tsx` | `components/GranterHiddenMenuList/GranterHiddenMenuList.tsx` |
| `_components_sidebar_navigation_CenterNavigation.tsx` | `components/GranterCenterNavigation/GranterCenterNavigation.tsx` |
| `_components_sidebar_navigation_bottomNavigation.tsx` | `components/GranterBottomProfile/GranterBottomProfile.tsx` |
| `_components_header_workspaceHeader_index.tsx` | `components/GranterHeader/GranterHeader.tsx` |
| `_components_header_workspaceHeader__shared_headerDatePicker.tsx` | `components/GranterHeaderDatePicker/GranterHeaderDatePicker.tsx` |
| `_components_header_workspaceHeader__shared_headerSlot.tsx` | `components/GranterHeaderSlot/GranterHeaderSlot.tsx` |
| `_components_header_workspaceHeader__shared_salaryHistoryDatePicker_index.tsx` | `components/GranterSalaryHistoryDatePicker/GranterSalaryHistoryDatePicker.tsx` |
| `_components_layouts_workspacePageLayout_index.tsx` | `GranterTemplate.tsx`, `components/GranterWorkspacePageLayout/GranterWorkspacePageLayout.tsx` |
| `_components_sidebar_navigation_index.tsx` | `components/GranterSidebar/GranterSidebar.tsx` |
| `_components_sidebar_workspace_index.tsx` | `components/GranterWorkspaceSidebar/GranterWorkspaceSidebar.tsx` |
| `workspace/home body - banner` | `../../../Item/components/GranterHomeBanner/GranterHomeBanner.tsx` |
| `workspace/home body - dashboard shell` | `../../../Item/components/GranterHomeDashboardCard/GranterHomeDashboardCard.tsx` |
| `workspace/home body - metric overview` | `../../../Item/components/GranterHomeMetricOverview/GranterHomeMetricOverview.tsx` |
| `workspace/home body - asset metric cards` | `../../../Item/components/GranterHomeAssetMetricGrid/GranterHomeAssetMetricGrid.tsx` |
| `workspace/home body - tag cards` | `../../../Item/components/GranterHomeTagGrid/GranterHomeTagGrid.tsx` |
| `workspace/home body - people cards` | `../../../Item/components/GranterHomePeopleGrid/GranterHomePeopleGrid.tsx` |
| `workspace/home body - asset cards` | `../../../Item/components/GranterHomeAssetCardGrid/GranterHomeAssetCardGrid.tsx` |
| `workspace/home body - notice banner` | `../../../Item/components/GranterHomePollBanner/GranterHomePollBanner.tsx` |
| `workspace/home body - content stack` | `components/GranterHomeContent/GranterHomeContent.tsx` |
| `app/workspace/pattern/_shared/conditionStep.tsx` | `../../../Item/components/GranterPatternStepCard/GranterPatternStepCard.tsx` |
| `app/workspace/pattern/_shared/previewStep.tsx` | `../../../Item/components/GranterPatternPreviewTable/GranterPatternPreviewTable.tsx`, `../../../Item/components/GranterPatternAssignmentSummary/GranterPatternAssignmentSummary.tsx` |
| `app/workspace/pattern/_shared/patternContainer.tsx` | `components/GranterPatternLayout/GranterPatternLayout.tsx` |
| `app/workspace/profile/_shared/contents/CategoryInfo/CategoryGrid.tsx` | `../../../Item/components/GranterProfileCategoryGrid/GranterProfileCategoryGrid.tsx` |

## Composition Rule

- Pure UI components are kept under `components/`.
- Page-level business logic must stay in page layouts (for example `src/pages/UiSamplePage/layouts/DesktopLayout.tsx`).

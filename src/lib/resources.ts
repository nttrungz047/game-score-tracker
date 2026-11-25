import type { Locale } from "./domain";

export type ResourceKey =
  | "app"
  | "sessions"
  | "newSession"
  | "create"
  | "open"
  | "duplicate"
  | "delete"
  | "settings"
  | "game"
  | "unit"
  | "players"
  | "addPlayer"
  | "save"
  | "cancel"
  | "addRound"
  | "round"
  | "score"
  | "scorePlaceholder"
  | "ranking"
  | "history"
  | "chart"
  | "share"
  | "download"
  | "copyImage"
  | "copied"
  | "noRounds"
  | "note"
  | "theme"
  | "language"
  | "reset"
  | "confirm"
  | "confirmDescription"
  | "empty"
  | "back"
  | "roundCount"
  | "name"
  | "playerName"
  | "system"
  | "light"
  | "dark"
  | "edit"
  | "unsupported"
  | "close"
  | "confirmAction"
  | "localScoreboard"
  // | "defaultGame"
  | "defaultUnit"
  | "playersPlaceholder"
  | "downloaded"
  | "createdAt"
  | "updatedAt"
  | "metricTotal"
  | "metricAverage"
  | "metricRounds"
  | "metricHighest";

export type Resources = Record<ResourceKey, string>;

export const resources: Record<Locale, Resources> = {
  vi: {
    app: "Write Score",
    sessions: "Phiên chơi",
    newSession: "Phiên mới",
    create: "Tạo phiên",
    open: "Mở",
    duplicate: "Nhân bản",
    delete: "Xóa",
    settings: "Cài đặt",
    game: "Trò chơi",
    unit: "Đơn vị",
    players: "Người chơi",
    addPlayer: "Thêm người chơi",
    save: "Lưu",
    cancel: "Hủy",
    addRound: "Thêm vòng",
    round: "Vòng",
    score: "Điểm",
    scorePlaceholder: "0",
    ranking: "Bảng xếp hạng",
    history: "Lịch sử",
    chart: "Biểu đồ",
    share: "Chia sẻ",
    download: "Lưu",
    copyImage: "Copy",
    copied: "Đã copy",
    noRounds: "Chưa có vòng chơi nào",
    note: "Ghi chú",
    theme: "Giao diện",
    language: "Ngôn ngữ",
    reset: "Reset toàn bộ dữ liệu",
    confirm: "Xác nhận thao tác",
    confirmDescription:
      "Thao tác này có thể làm mất dữ liệu. Bạn có chắc muốn tiếp tục?",
    empty: "Tạo phiên đầu tiên để bắt đầu ghi điểm.",
    back: "Quay lại",
    roundCount: "vòng",
    name: "Tên phiên",
    playerName: "Tên người chơi",
    system: "Theo hệ thống",
    light: "Sáng",
    dark: "Tối",
    edit: "Sửa",
    unsupported:
      "Trình duyệt không hỗ trợ copy ảnh. Bạn có thể lưu ảnh về máy.",
    close: "Đóng",
    confirmAction: "Xác nhận",
    localScoreboard: "BẢNG ĐIỂM LOCAL",
    // defaultGame: "Trò chơi",
    defaultUnit: "điểm",
    playersPlaceholder: "An, Bình, Chi",
    createdAt: "Tạo lúc",
    updatedAt: "Cập nhật lúc",
    metricTotal: "Tổng điểm",
    metricAverage: "Trung bình / người",
    metricRounds: "Số vòng",
    metricHighest: "Điểm cao nhất",
    downloaded: "Đã tạo ảnh",
  },
  en: {
    app: "Write Score",
    sessions: "Sessions",
    newSession: "New session",
    create: "Create session",
    open: "Open",
    duplicate: "Duplicate",
    delete: "Delete",
    settings: "Settings",
    game: "Game",
    unit: "Unit",
    players: "Players",
    addPlayer: "Add player",
    save: "Save",
    cancel: "Cancel",
    addRound: "Add round",
    round: "Round",
    score: "Score",
    scorePlaceholder: "0",
    ranking: "Ranking",
    history: "History",
    chart: "Chart",
    share: "Share",
    download: "Save",
    copyImage: "Copy",
    copied: "Copied",
    noRounds: "No rounds yet",
    note: "Note",
    theme: "Theme",
    language: "Language",
    reset: "Reset all data",
    confirm: "Confirm action",
    confirmDescription:
      "This action may remove data. Are you sure you want to continue?",
    empty: "Create your first session to start scoring.",
    back: "Back",
    roundCount: "rounds",
    name: "Session name",
    playerName: "Player name",
    system: "System",
    light: "Light",
    dark: "Dark",
    edit: "Edit",
    unsupported:
      "This browser cannot copy images. You can save the image instead.",
    close: "Close",
    confirmAction: "Confirm",
    localScoreboard: "LOCAL SCOREBOARD",
    // defaultGame: "Game",
    defaultUnit: "points",
    playersPlaceholder: "An, Binh, Chi",
    createdAt: "Created",
    updatedAt: "Updated",
    metricTotal: "Total score",
    metricAverage: "Average / player",
    metricRounds: "Rounds",
    metricHighest: "Highest score",
    downloaded: "Image created",
  },
};

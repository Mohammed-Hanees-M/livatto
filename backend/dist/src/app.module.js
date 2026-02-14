"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const core_1 = require("@nestjs/core");
const prisma_service_1 = require("./prisma.service");
const auth_module_1 = require("./modules/auth/auth.module");
const videos_module_1 = require("./modules/videos/videos.module");
const schedules_module_1 = require("./modules/schedules/schedules.module");
const streams_module_1 = require("./modules/streams/streams.module");
const ai_tools_module_1 = require("./modules/ai-tools/ai-tools.module");
const analytics_module_1 = require("./modules/analytics/analytics.module");
const settings_module_1 = require("./modules/settings/settings.module");
const all_exceptions_filter_1 = require("./filters/all-exceptions.filter");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({
                isGlobal: true,
            }),
            auth_module_1.AuthModule,
            videos_module_1.VideosModule,
            schedules_module_1.SchedulesModule,
            streams_module_1.StreamsModule,
            ai_tools_module_1.AiToolsModule,
            analytics_module_1.AnalyticsModule,
            settings_module_1.SettingsModule,
        ],
        providers: [
            prisma_service_1.PrismaService,
            {
                provide: core_1.APP_FILTER,
                useClass: all_exceptions_filter_1.AllExceptionsFilter,
            },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map
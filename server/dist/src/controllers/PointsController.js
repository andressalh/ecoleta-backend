"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var conection_1 = __importDefault(require("../database/conection"));
var PointsController = /** @class */ (function () {
    function PointsController() {
    }
    PointsController.prototype.index = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, city, uf, items, parsedItems, points, serializedPoints;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.query, city = _a.city, uf = _a.uf, items = _a.items;
                        parsedItems = String(items)
                            .split(',')
                            .map(function (item) { return Number(item.trim()); });
                        return [4 /*yield*/, conection_1.default('points')
                                .join('point_items', 'points.id', '=', 'point_items.point_id')
                                .whereIn('point_items.item_id', parsedItems)
                                .where('city', String(city))
                                .where('uf', String(uf))
                                .distinct()
                                .select('points.*')];
                    case 1:
                        points = _b.sent();
                        serializedPoints = points.map(function (point) {
                            return __assign(__assign({}, point), { image_url: "http://192.168.15.13:3333/uploads/" + point.image });
                        });
                        if (!points)
                            return [2 /*return*/, response.status(400).json({ error: "Point not found!" })];
                        return [2 /*return*/, response.json(serializedPoints)];
                }
            });
        });
    };
    PointsController.prototype.show = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var id, point, serializedPoint, items;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        id = request.params.id;
                        return [4 /*yield*/, conection_1.default('points').where('id', id).first()];
                    case 1:
                        point = _a.sent();
                        if (!point) {
                            return [2 /*return*/, response.status(400).json({ message: 'Point not found.' })];
                        }
                        serializedPoint = __assign(__assign({}, point), { image_url: "http://192.168.15.13:3333/uploads/" + point.image });
                        return [4 /*yield*/, conection_1.default('items')
                                .join('point_items', 'items.id', '=', 'point_items.item_id')
                                .where('point_items.point_id', id)
                                .select('items.title')];
                    case 2:
                        items = _a.sent();
                        if (!items)
                            return [2 /*return*/, response.status(400).json({ error: "Item on point not found!" })];
                        return [2 /*return*/, response.json({ point: serializedPoint, items: items })];
                }
            });
        });
    };
    ;
    PointsController.prototype.create = function (request, response) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, name, email, whatsapp, latitude, longitude, city, uf, items, trx, point, insertedIds, point_id, pointItems, error_1;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = request.body, name = _a.name, email = _a.email, whatsapp = _a.whatsapp, latitude = _a.latitude, longitude = _a.longitude, city = _a.city, uf = _a.uf, items = _a.items;
                        return [4 /*yield*/, conection_1.default.transaction()];
                    case 1:
                        trx = _b.sent();
                        point = {
                            image: request.file.filename,
                            name: name,
                            email: email,
                            whatsapp: whatsapp,
                            latitude: latitude,
                            longitude: longitude,
                            city: city,
                            uf: uf,
                        };
                        return [4 /*yield*/, trx('points').insert(point)];
                    case 2:
                        insertedIds = _b.sent();
                        point_id = insertedIds[0];
                        pointItems = items
                            .split(',')
                            .map(function (item) { return Number(item.trim()); })
                            .map(function (item_id) {
                            return {
                                item_id: item_id,
                                point_id: point_id,
                            };
                        });
                        _b.label = 3;
                    case 3:
                        _b.trys.push([3, 6, , 8]);
                        return [4 /*yield*/, trx('point_items').insert(pointItems)];
                    case 4:
                        _b.sent();
                        return [4 /*yield*/, trx.commit()];
                    case 5:
                        _b.sent(); // create inserts in the database
                        return [3 /*break*/, 8];
                    case 6:
                        error_1 = _b.sent();
                        return [4 /*yield*/, trx.rollback()];
                    case 7:
                        _b.sent();
                        return [2 /*return*/, response.status(400).json({
                                message: 'Falha na inserção na tabela point_items, verifique se os items informados são válidos'
                            })];
                    case 8: return [2 /*return*/, response.json(__assign({ id: point_id }, point))];
                }
            });
        });
    };
    return PointsController;
}());
;
exports.default = PointsController;